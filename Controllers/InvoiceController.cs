using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using SWENAR.Data;
using SWENAR.Models;
using SWENAR.Validation;
using SWENAR.ViewModels;

namespace SWENAR.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly SWENARDBContext _db;
        private readonly IWebHostEnvironment _env;

        public InvoiceController(SWENARDBContext db, IWebHostEnvironment env)
        {
            this._db = db;
            this._env = env;
        }

        /// <summary>
        /// Method to get all Invoices
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> Get()
        {
            var Invoices = await _db.Invoices
                .OrderBy(a => -a.Id).ToListAsync();
            return Invoices;
        }

        /// <summary>
        /// Method to get a Invoice 
        /// </summary>
        /// <param name="id">Invoice Id</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> Get(int id)
        {
            var invoice = await _db.Invoices.FindAsync(id);

            if (invoice is null)
            {
                return NotFound();
            }

            return invoice;
        }

        /// <summary>
        /// Method to create a Invoice in database
        /// </summary>
        /// <param name="vm">Invoice create view model</param>
        /// <returns></returns>
        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Invoice>> Create(InvoiceCreateVm vm)
        {

            var invoice = new Invoice()
            {
                CustomerId = vm.CustomerId,
                InvoiceNumber = vm.InvoiceNumber,
                Amount = vm.Amount,
                InvoiceDate = Convert.ToDateTime(vm.InvoiceDate),
                DueDate = Convert.ToDateTime(vm.DueDate)
            };

            _db.Invoices.Add(invoice);

            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = invoice.Id }, invoice);
        }

        /// <summary>
        /// Method to update an existing Invoice
        /// </summary>
        /// <param name="id">Invoice Id</param>
        /// <param name="vm">Invoice update view model</param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(int id, InvoiceUpdateVm vm)
        {
            if (id != vm.Id)
            {
                return BadRequest();
            }

            var invoice = await _db.Invoices.FindAsync(vm.Id);

            if (invoice is null)
            {
                return NotFound();
            }

            invoice.CustomerId = vm.CustomerId;
            invoice.InvoiceNumber = vm.InvoiceNumber;
            invoice.Amount = vm.Amount;
            invoice.InvoiceDate = Convert.ToDateTime(vm.InvoiceDate);
            invoice.DueDate = Convert.ToDateTime(vm.DueDate);
            invoice.Status = vm.Status ?? invoice.Status;

            await _db.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Method to delete an existing Invoice 
        /// </summary>
        /// <param name="id">Invoice Id</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Invoice>> Delete(int id)
        {
            var invoice = await _db.Invoices.FindAsync(id);

            if (invoice is null)
            {
                return NotFound();
            }

            _db.Invoices.Remove(invoice);
            await _db.SaveChangesAsync();
            return invoice;
        }

        /// <summary>
        /// Loads excel file with invoices to the database
        /// </summary>
        /// <param name="excelFile">IFormfile Excel file</param>
        /// <returns>List of rows from excel file</returns>
        [HttpPost("Load")]
        public async Task<ActionResult<IEnumerable<InvoiceLoadVm>>> Load([FromForm]IFormFile excelFile)
        {
            var customers = await _db.Customers.ToListAsync();

            if (excelFile == null || excelFile.Length <= 0)
            {
                return null;
            }

            if (!Path.GetExtension(excelFile.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            var invoiceVms = ReadFile(excelFile);
            await _db.Customers.AddRangeAsync(invoiceVms
                .Where(a => !customers.Any(c => c.Number.ToLower() == a.CustomerNumber.ToLower()))
                .Select(a => new Customer()
                {
                    Name = a.CustomerName,
                    Number = a.CustomerNumber
                }));

            await _db.SaveChangesAsync();
            customers = await _db.Customers.ToListAsync();
            var currentMaxInvoiceId = await _db.Invoices.MaxAsync(a => a.Id);

            await _db.Invoices.AddRangeAsync(invoiceVms.Select(i => new Invoice()
            {
                CustomerId = customers.SingleOrDefault(c => c.Number.ToLower() == i.CustomerNumber.ToLower()).Id,
                InvoiceNumber = i.InvoiceNumber,
                InvoiceDate = i.InvoiceDate,
                DueDate = i.DueDate,
                Amount = i.Amount,
                Status = InvoiceStatus.PendingPayment
            }));

            await _db.SaveChangesAsync();

            return _db.Invoices
                .Where(i => i.Id > currentMaxInvoiceId)
                .Select(i => new InvoiceLoadVm()
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    InvoiceDate = i.InvoiceDate,
                    DueDate = i.DueDate,
                    Amount = i.Amount
                }).ToList();
        }

        /// <summary>
        /// Reads excel and return a list of rows
        /// </summary>
        /// <param name="excelFile">Excel file</param>
        /// <returns>List of rows</returns>
        private static List<InvoiceLoadVm> ReadFile(IFormFile excelFile)
        {
            var invoices = new List<InvoiceLoadVm>();
            using (var package = new ExcelPackage(excelFile.OpenReadStream()))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension.Rows;

                for (int row = 2; row <= rowCount; row++)
                {
                    var invoice = new InvoiceLoadVm()
                    {
                        CustomerName = worksheet.Cells[row, 1].Value.ToString().Trim(),
                        CustomerNumber = worksheet.Cells[row, 2].Value.ToString().Trim(),
                        InvoiceNumber = worksheet.Cells[row, 3].Value.ToString().Trim(),
                        InvoiceDate = Convert.ToDateTime(worksheet.Cells[row, 4].Value.ToString().Trim()),
                        DueDate = Convert.ToDateTime(worksheet.Cells[row, 5].Value.ToString().Trim()),
                        Amount = Convert.ToDecimal(worksheet.Cells[row, 6].Value.ToString().Trim())
                    };

                    invoices.Add(invoice);
                }
            }

            return invoices;
        }
    }


}