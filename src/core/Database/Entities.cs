using AltV.Net.Data;
using AltV.Net.Enums;
using core.Usefull;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static core.Enums.Enums;

namespace core.Database {
	public class Account {
		[Key]
		public int id { get; set; }
		public long discordId { get; set; }
		public string username { get; set; }
		public string discriminator { get; set; }
		public DateTime? lastLogin { get; set; }
		public BoolState cleanable { get; set; }
	}
	public class Character {
		[Key]
		public int id { get; set; }
		public int  charID { get; set; }
		public PedModel model { get; set; }
		public string name { get; set; }
		public Position position { get; set; }
		public Rotation rotation { get; set; }
		public int dimension { get; set; }
		public DateTime? birthdate { get; set; }
		public DateTime? creation { get; set; }
		public TeamState team { get; set; }
		public double hunger { get; set; }
		public double thirst { get; set; }
		public double blood { get; set; }
		public double mood { get; set; }
		public double voice { get; set; }
		public int armour { get; set; }
		public DateTime arrest { get; set; }
		public int warnings { get; set; }
		public BoolState ban { get; set; }
		public BoolState whitelist { get; set; }
		public BoolState unconscious { get; set; }
		public BoolState editable { get; set; }
		public Handy handy { get; set; }
		public Skills skills { get; set; }
		public Dictionary<string, object> design { get; set; }
		public Dictionary<BodyPart, int> medical { get; set; }
		public Inventory inventory { get; set; }
	}
	public class Travel {
		[Key]
		public int id { get; set; }
		public int charID { get; set; }
		public DateTime? arrival { get; set; }
		public TravelState type { get; set; }
	}
}
