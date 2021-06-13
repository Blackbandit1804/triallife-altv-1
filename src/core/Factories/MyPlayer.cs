using AltV.Net;
using AltV.Net.Elements.Entities;
using System;
using System.Collections.Generic;

namespace roleplay.Factories {
	public class MyPlayer : Player {
		public bool LoggedIn { get; set; }
		public int CharID { get; set; }
		public MyPlayer(IntPtr nativePointer, ushort id) : base(nativePointer, id) {
			LoggedIn = false;
			CharID = 0;
		}
	}

	public class MyPlayerFactory : IEntityFactory<IPlayer> {
		public IPlayer Create(IntPtr nativePointer, ushort id) {
			return new MyPlayer(nativePointer, id);
		}
	}
}
