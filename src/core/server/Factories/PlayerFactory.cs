using AltV.Net;
using AltV.Net.Elements.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using triallife.Database.Models;
using triallife.Utility;

namespace triallife.Factories {

	public class MyPlayer : Player {
		public bool pendingLogin { get; set; }
		public bool pendingCharEdit { get; set; }
		public bool pendingCharCreate { get; set; }
		public bool pendingCharSelect { get; set; }
		public string discordToken { get; set; }
		public bool hasModel { get; set; }
		public Account accountData { get; set; }
		public List<Character> characters { get; set; }
		public DiscordUser discord { get; set; }
		public Character data { get; set; }
		public Vector3 acPosition { get; set; }
		public int acArmour { get; set; }
		public long nextRespawnTime { get; set; }
		public long nextItemSync { get; set; }
		public long nextStatSync { get; set; }
		public long nextPlayTime { get; set; }
		public LastToolbarData lastToolbarData { get; set; }
		public int gridSpace { get; set; }
		public int weather { get; set; }
		public int lastEnteredVehicleID { get; set; }
		public int lastVehicleID { get; set; }

		public MyPlayer(IntPtr nativePointer, ushort id) : base(nativePointer, id) {}
		
		public void init(Character data = null) {
			this.data = new Character();
		}
	}

	public class MyPlayerFactory : IEntityFactory<IPlayer> {
		public IPlayer Create(IntPtr playerPointer, ushort id) {
			return new MyPlayer(playerPointer, id);
		}
	}
}
