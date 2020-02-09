using System;
using System.ComponentModel.DataAnnotations;

namespace SWENAR.Models
{
    public class Customer
    {
        [Key]
        public int id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
    }
}
