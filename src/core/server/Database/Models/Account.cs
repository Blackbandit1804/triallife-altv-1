using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using triallife.Helper;

namespace triallife.Database.Models {

	public class Account {
		[Key]
		public int id { get; set; }
		public long discord { get; set; }
		public List<string> ips { get; set; }
		public List<string> hardware { get; set; }
		public long lastLogin { get; set; }
		public Permission permissionLevel { get; set; }
		public bool banned { get; set; }
		public string reason { get; set; }
	}
}
