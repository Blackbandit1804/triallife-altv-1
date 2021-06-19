using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Helper {
	public class Inventory {
		public double maxWeight { get; set; }
		public List<Item> items { get; set; }
	}

	public class Item {
		public string name { get; set; }
		public string uuid { get; set; }
		public string description { get; set; }
		public string icon { get; set; }
		public int quantity { get; set; }
		public ItemType behavior { get; set; }
		public int slot { get; set; }
		public string hash { get; set; }
		public EquipmentType equipment { get; set; }
		public Dictionary<string, object> data { get; set; }
	}

	public class ItmSpecial : Item {
		public string dataName { get; set; }
		public int dataIndex { get; set; }
		public int dataTab { get; set; }
		public bool isInventory { get; set; }
		public bool isEquipment { get; set; }
		public bool isToolbar { get; set; }
	}

	public class DroppedItem {
		public Item item { get; set; }
		public Vector3 position { get; set; }
		public int dimension { get; set; }
	}
}
