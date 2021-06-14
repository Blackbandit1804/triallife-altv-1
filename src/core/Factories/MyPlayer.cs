using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using core.Database;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using static core.Usefull.Enums;

namespace core.Factories {
	public class MyPlayer : Player {
		#region Player States
		public bool? pendingLogin { get; set; }
		public string discordToken { get; set; }
		public bool? needsQT { get; set; }
		public bool? hasModel { get; set; }
		public List<Character> characters { get; set; }
		public bool? pendingCharEdit { get; set; }
		public bool? pendingCharCreate { get; set; }
		public bool? pendingCharSelect { get; set; }
		#endregion
		#region Player data
		public Account accountData { get; set; }
		public SocketUser discord { get; set; }
		public Character data { get; set; }
		#endregion
		#region Anti Cheat
		public Position? acPosition { get; set; }
		public int acArmour { get; set; }
		public double? acBlood { get; set; }
		public double? acHunger { get; set; }
		public double? acThirst { get; set; }
		public double? acMood { get; set; }
		#endregion
		#region Status effects
		public long nextUnconsciousSpawn { get; set; }
		public long nextPingTime { get; set; }
		public long nextItemSync { get; set; }
		public long nextStatSync { get; set; }
		public long nextPlayTime { get; set; }
		#endregion
		#region Toolbar Info
		public Dictionary<string, object> lastToolbarData { get; set; }
		#endregion
		#region World Info
		public int gridSpace { get; set; }
		public string weather { get; set; }
		#endregion
		#region Vehicle Info
		public int lastEnteredVehicleID { get; set; }
		public int lastVehicleID { get; set; }
		#endregion
		public MyPlayer(IntPtr nativePointer, ushort id) : base(nativePointer, id) {
		}
	}

	public class MyPlayerFactory : IEntityFactory<IPlayer> {
		public IPlayer Create(IntPtr nativePointer, ushort id) {
			return new MyPlayer(nativePointer, id);
		}
	}
}
