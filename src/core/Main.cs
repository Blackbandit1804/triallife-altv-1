using AltV.Net;
using AltV.Net.Elements.Entities;
using core.Database;
using core.Factories;
using System;

namespace core {
	class Main : Resource {

		public override void OnStart() {
			Logger.Initialize();
			TlrpEntities.Initialize();
			var db = new TlrpEntities();
			Logger.LogColored(new string[] {
				"3L:RP ", "Gamemode ", "0.1 (alpha)"
			}, new ConsoleColor[] { ConsoleColor.Green, ConsoleColor.Gray, ConsoleColor.DarkYellow });
			if (db.Database.EnsureCreated()) {
				Logger.LogColored(new string[] { "Database successfully created" }, new ConsoleColor[0]);
			}
		}

		public override void OnStop() {
			Logger.LogColored(new string[] {
				"3L:RP ", "Gamemode ", "0.1 (alpha)"
			}, new ConsoleColor[] { ConsoleColor.Green, ConsoleColor.Gray, ConsoleColor.DarkYellow });
			Logger.Uninitialize();
		}

		public override IEntityFactory<IPlayer> GetPlayerFactory() {
			return new MyPlayerFactory();
		}

		public override IEntityFactory<IVehicle> GetVehicleFactory() {
			return new MyVehicleFactory();
		}
	}
}
