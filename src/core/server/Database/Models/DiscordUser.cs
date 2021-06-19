using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Database.Models {
	public class DiscordUser {
		public string id { get; set; }
		public string name { get; set; }
		public string discriminator { get; set; }
		public string avatar { get; set; }
	}
}
