using System.Collections.Generic;
using System.Threading.Tasks;
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
    public class CustomerController : ControllerBase
    {
        private readonly SWENARDBContext _db;
        public CustomerController(SWENARDBContext db)
        {
            this._db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> Get()
        {
            var customers = await _db.Customers.ToListAsync();
            return customers;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            var customer = await _db.Customers.FindAsync(id);
            return customer;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Customer>> Create(CustomerCreateVm vm)
        {

            var customer = new Customer()
            {
                Name = vm.Name,
                Number = vm.Number
            };

            _db.Customers.Add(customer);

            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = customer.id }, customer);
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(int id, CustomerUpdateVm vm)
        {
            if (id != vm.Id)
            {
                return BadRequest();
            }

            var customer = await _db.Customers.FindAsync(vm.Id);

            if (customer is null)
            {
                return NotFound();
            }

            customer.Name = vm.Name;
            customer.Number = vm.Number;

            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Customer>> Delete(int id)
        {
            var customer = await _db.Customers.FindAsync(id);

            if (customer is null)
            {
                return NotFound();
            }

            _db.Customers.Remove(customer);
            await _db.SaveChangesAsync();
            return customer;
        }
    }
}