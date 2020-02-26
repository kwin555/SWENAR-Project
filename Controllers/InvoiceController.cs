using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public InvoiceController(SWENARDBContext db)
        {
            this._db = db;
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

        [HttpPost]
        public async Task<IActionResult> Load(IFormFile excelFile)
        {
            await Task.FromResult(0);
            return Ok();
        }
    }
}