using AltV.Net.Data;
using AltV.Net.Enums;
using core.Usefull;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static core.Usefull.Enums;

namespace core.Database {
	public class Account {
		[Key]
		public int id { get; set; }
		public string discord { get; set; }
		public List<string> ips { get; set; }
		public List<string> hardware { get; set; }
		public long lastLogin { get; set; }
		public Permission permissionLevel { get; set; }
		public string quickToken { get; set; }
		public long quickTokenExpiration { get; set; }
		public bool banned { get; set; }
		public string reason { get; set; }
	}
	public class Character {
		[Key]
		public int id { get; set; }
		public int  accId { get; set; }
		public Position position { get; set; }
		public string name { get; set; }
		public double cash { get; set; }
		public double bank { get; set; }
		public double blood { get; set; }
		public int armour { get; set; }
		public double hunger { get; set; }
		public double thirst { get; set; }
		public double mood { get; set; }
		public bool isUnconscious { get; set; }
		public double hours { get; set; }
		public string interior { get; set; }
		public Position exterior { get; set; }
		public Design design { get; set; }
		public CharInfo info { get; set; }
		public List<List<Item>> inventory { get; set; }
		public List<Item> equipment { get; set; }
		public List<Item> toolbar { get; set; }
		public List<Vehicle> vehicles { get; set; }
	}
	public class Vehicle {
		[Key]
		public int id { get; set; }
		public string model { get; set; }
		public Position position { get; set; }
		public Rotation rotation { get; set; }
		public double fuel { get; set; }
		public Color color { get; set; }
	}
}
