using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWENAR.Data;
using SWENAR.Models;
using SWENAR.Validation;
using SWENAR.ViewModels;
using static SWENAR.Helpers.FileHelpers;

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


        [HttpPost("Load")]
        public async Task<ActionResult<IEnumerable<Invoice>>> Load([FromForm]IFormFile excelFile)
        {
            var customers = await _db.Customers.ToListAsync();
            var invoices = new List<Invoice>();
            using (SpreadsheetDocument doc = SpreadsheetDocument.Open(excelFile.OpenReadStream(), false))
            {
                WorkbookPart workbookPart = doc.WorkbookPart;
                WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();
                SheetData sheetData = worksheetPart.Worksheet.Elements<SheetData>().First();
                var rowCount = 0;
                foreach (Row r in sheetData.Elements<Row>())
                {
                    var rowIsValid = true;
                    var invoice = new Invoice();

                    if (rowCount > 0)
                    {
                        var cellCount = 0;

                        foreach (Cell c in r.Elements<Cell>())
                        {
                            var cellValue = c.InnerText;
                            var stringTable = workbookPart.GetPartsOfType<SharedStringTablePart>()
                                           .FirstOrDefault();
                            if (stringTable != null
                                && c.DataType != null
                                && (c.DataType.Value == CellValues.SharedString || c.DataType.Value == CellValues.Date))
                            {
                                cellValue =
                                    stringTable.SharedStringTable
                                    .ElementAt(int.Parse(cellValue)).InnerText;
                            }

                            var customerName = string.Empty;
                            switch (cellCount)
                            {
                                case 0:
                                    customerName = cellValue;
                                    break;
                                case 1:
                                    if (!customers.Any(a => a.Number.ToLower() == cellValue.ToLower()))
                                    {
                                        _db.Customers.Add(new Customer()
                                        {
                                            Name = customerName,
                                            Number = cellValue
                                        });
                                    }
                                    break;
                                case 2:
                                    invoice.InvoiceNumber = cellValue;
                                    break;
                                case 3:
                                    if (DateTime.TryParse(cellValue, out DateTime invDate))
                                    {
                                        invoice.InvoiceDate = invDate;
                                    }
                                    else
                                    {
                                        rowIsValid = false;
                                    }
                                    break;
                                case 4:
                                    if (DateTime.TryParse(cellValue, out DateTime dueDate))
                                    {
                                        invoice.DueDate = dueDate;
                                    }
                                    else
                                    {
                                        rowIsValid = false;
                                    }
                                    break;
                                default:
                                    break;
                            }
                            cellCount++;

                        }

                    }

                    if (rowIsValid && !string.IsNullOrWhiteSpace(invoice.InvoiceNumber))
                    {
                        invoices.Add(invoice);
                    }
                    rowCount++;
                }
            }
            await _db.SaveChangesAsync();

            _db.Invoices.AddRange(invoices);
            await _db.SaveChangesAsync();
            return invoices;
        }
    }


}