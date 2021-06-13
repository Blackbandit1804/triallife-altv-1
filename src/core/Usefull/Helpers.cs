using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Usefull {
	public class Handy {
		public bool power { get; set; }
		public Dictionary<int, object> contacts { get; set; }
		public List<string> apps { get; set; }
		public Dictionary<string, object> settings { get; set; } = new Dictionary<string, object>() { { "flymode", false }, { "anonym", false }, { "volume", 1.0 }, { "background", 0 }, { "sound", 0 } };
	}

	public class Inventory { 
		public double Money { get; set; }
		public List<Dictionary<string, object>> Items { get; set; }
		public double MaxWeight { get; set; }
	}

	public class Skills {
		public Dictionary<string, double> stamina { get; set; }
		public Dictionary<string, double> strength { get; set; }
		public Dictionary<string, double> shooting { get; set; }
		public Dictionary<string, double> lungcapacity { get; set; }
	}
}
