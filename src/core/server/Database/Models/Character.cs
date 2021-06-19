using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Numerics;
using triallife.Helper;

namespace triallife.Database.Models {
	public class Character {
		[Key]
		public int id { get; set; }
		public int accId { get; set; }
		public Vector3 pos { get; set; } = new Vector3(-867.1437377929688f, -172.6201934814453f, 37.799232482910156f);
		public string name { get; set; }
		public int bankId { get; set; } = 0;
		public int armour { get; set; } = 0;
		public double money { get; set; } = 500;
		public double blood { get; set; } = 7500;
		public double hunger { get; set; } = 100;
		public double thirst { get; set; } = 100;
		public double mood { get; set; } = 100;
		public bool isUnconsciouse { get; set; } = false;
		public int hours { get; set; } = 0;
		public string interior { get; set; }
		public Vector3 exterior { get; set; }
		public Design design { get; set; } = new Design();
		public CharInfo info { get; set; } = new CharInfo();
		public Inventory inventory { get; set; } = new Inventory() { maxWeight = 15, items = new List<Item>() };
		public List<Item> equipment { get; set; } = new List<Item>(8);
		public List<Item> toolbar { get; set; } = new List<Item>(5);
		public List<Vehicle> vehicles { get; set; } = new List<Vehicle>();
	}

	public class CharInfo {
		public string gender { get; set; }
		public int age { get; set; }
	}
}
