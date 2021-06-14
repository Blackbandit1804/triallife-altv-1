using AltV.Net.Data;
using core.configs;
using core.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using static core.Usefull.Enums;

namespace core.Usefull {


	public class AudioStream {
		public string streamName { get; set; }
		public long duration { get; set; }
		public Position position { get; set; }
	}

	public class AudioStreamData : AudioStream {
		public long endTime { get; set; }
	}

	public class Particle {
		public Position position { get; set; }
		public string dict { get; set; }
		public string name { get; set; }
		public long duration { get; set; }
		public int scale { get; set; }
		public long delay { get; set; }
	}

	public class ProgressBar {
		public string uid { get; set; }
		public Position position { get; set; }
		public Color color { get; set; }
		public long milliseconds { get; set; }
		public float distance { get; set; }
		public string text { get; set; }
		public long startTime { get; set; }
		public long finalTime { get; set; }
	}

	public class Color {
		public int r { get; set; }
		public int g { get; set; }
		public int b { get; set; }
		public int a { get; set; }
	}

	public class Task {
		public string nativeName { get; set; }
		public object[] parameters { get; set; }
		public long timeToWaitInMS { get; set; }
	}

	public class TaskCallback {
		public string callbackName { get; set; }
	}

	public class Vehicle {
		public string uid { get; set; }
		public string model { get; set; }
		public Position position { get; set; }
		public Rotation rotation { get; set; }
		public double fuel { get; set; }
		public Color color { get; set; }
	}

	public class Design {
		public int sex { get; set; }
		public int faceFather { get; set; }
		public int faceMother { get; set; }
		public int skinFather { get; set; }
		public int skinMother { get; set; }
		public float faceMix { get; set; }
		public float skinMix { get; set; }
		public List<int> structure { get; set; }
		public int hair { get; set; }
		public int hairColor1 { get; set; }
		public int hairColor2 { get; set; }
		public HairOverlay hairOverlay { get; set; }
		public int facialHair { get; set; }
		public int facialHairColor { get; set; }
		public float facialHairOpacity { get; set; }
		public int eyebrows { get; set; }
		public float eyebrowsOpacity { get; set; }
		public int eyes { get; set; }
		public List<DesignInfo> opacityOverlays { get; set; }
		public List<ColorInfo> colorOverlays { get; set; }
	}

	public class HairOverlay {
		public string overlay { get; set; }
		public string collection { get; set; }
	}

	public class DesignInfo {
		public int id { get; set; }
		public int value { get; set; }
		public float opacity { get; set; }
		public string collection { get; set; }
		public string overlay { get; set; }
	}

	public class ColorInfo {
		public int id { get; set; }
		public int value { get; set; }
		public int color1 { get; set; }
		public int color2 { get; set; }
		public float opacity { get; set; }
	}

	public class CharInfo {
		public string gender { get; set; }
		public int age { get; set; }
	}

	public class Item {
		public string name { get; set; }
		public string uuid { get; set; }
		public string description { get; set; }
		public string icon { get; set; }
		public int quantity { get; set; }
		public double weight { get; set; }
		public ItemType behavior { get; set; }
		public int slot { get; set; }
		public string hash { get; set; }
		public EquipmentType equipment { get; set; }
		public Dictionary<string, object> data { get; set; }
	}

	public class ItemSpecial : Item {
		public string dataName { get; set; }
		public int dataIndex { get; set; }
		public int dataTab { get; set; }
		public bool isInventory { get; set; }
		public bool isEquipment { get; set; }
		public bool isToolbar { get; set; }
	}

	public class Droppeditem {
		public Item item { get; set; }
		public Position position { get; set; }
		public int gridSpace { get; set; }
		public int dimension { get; set; }
	}

	public class CategoryData {
		public string abbrv { get; set; }
		public string name { get; set; }
		public Action emptyCheck { get; set; }
		public Action getItem { get; set; }
		public Action removeItem { get; set; }
		public Action addItem { get; set; }

	}
	public class Action {
		public string eventName { get; set; }
		public bool isServer { get; set; }
		public object data { get; set; }
	}
}
