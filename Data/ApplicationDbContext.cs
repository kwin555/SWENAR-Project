using SWENAR.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace SWENAR.Data
{
    public class SWENARDBContext : IdentityDbContext<User, Role, int>
    {
        public SWENARDBContext(
            DbContextOptions options) : base(options)
        {
        }
        public DbSet<Customer> Customer { get; set; }
    }
}
