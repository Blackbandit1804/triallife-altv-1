using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Database.Models {
	public class Option {
		public int id { get; set; }
		public List<string> whitelist { get; set; } = new List<string>();
	}
}
