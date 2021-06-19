using AltV.Net.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Database.Models {
	public class Vehicle {
		public int id { get; set; }
		public string model { get; set; }
		public Vector3 position { get; set; }
		public Vector3 rotation { get; set; }
		public double fuel { get; set; }
		public Rgba color { get; set; }
		//mods etc
	}
}
