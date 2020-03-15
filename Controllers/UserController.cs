using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SWENAR.Data;
using SWENAR.Identity;
using SWENAR.Models;
using SWENAR.ViewModels;
using SWENAR.Validation;

namespace SWENAR.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SWENARDBContext _db;
        private readonly UserManager<User> _userManager;

        public UserController(SWENARDBContext db, UserManager<User> userManager)
        {
            this._db = db;
            this._userManager = userManager;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<User>> Create(UserCreateVm vm)
        {
 
            var person = await _db.People
                .Include(p => p.Customer)
                .SingleOrDefaultAsync(p => p.Id == vm.PersonId);

            if (person.UserId == null)
            {
                var user = new User()
                {
                    UserName = vm.UserName
                };

                var userResult = await _userManager.CreateAsync(user, "Password@1");

                if (userResult.Succeeded)
                {
                    var newUser = await _db.Users.SingleOrDefaultAsync(u => u.UserName == user.UserName);
                    var roleResult = await _userManager.AddToRoleAsync(user, vm.Role);

                    if (roleResult.Succeeded)
                    {
                        person.UserId = user.Id;
                        user.Claims.Add(new IdentityUserClaim<int> { ClaimType = Claims.UserId, ClaimValue = user.Id.ToString() });

                        if (person.CustomerId != null)
                        {
                            user.Claims.Add(new IdentityUserClaim<int>
                            {
                                ClaimType = Claims.CustomerId,
                                ClaimValue = person.CustomerId.ToString()
                            });
                        }
                        var result = await _db.SaveChangesAsync();

                        if (result > 0)
                        {
                            return user;
                        }

                    }
                }

            }

            return null;
        }
    }
}