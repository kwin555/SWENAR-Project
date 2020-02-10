﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SWENAR.ViewModels
{
    public class CustomerCreateVm
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Number { get; set; }
    }
}