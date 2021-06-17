using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Database.Models {
	public class Account {
		[Key]
		public int id { get; set; }
		public long dcId { get; set; }
		public string name { get; set; }
		public string discriminator { get; set; }
		public string avatar { get; set; }
	}
}
