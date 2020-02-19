﻿using System;
using System.ComponentModel.DataAnnotations;

namespace SWENAR.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Number { get; set; }
    }
}
