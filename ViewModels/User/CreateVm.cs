using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SWENAR.ViewModels
{
    public class UserCreateVm: UserBaseVm
    {
        public int PersonId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
    }
}
