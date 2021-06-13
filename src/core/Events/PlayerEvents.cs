using AltV.Net;
using AltV.Net.Enums;
using roleplay.Factories;
using System;

namespace roleplay.Events {
	class PlayerEvents : IScript {

		[ScriptEvent(ScriptEventType.PlayerConnect)]
		public void OnPlayerConnect(MyPlayer player, string reason) {
			Logger.LogColored(new string[] {
				"[","+", "] ",
				$"{player.Name}"
			}, new ConsoleColor[] {
				ConsoleColor.Gray, ConsoleColor.Green, ConsoleColor.Gray, ConsoleColor.DarkYellow
			});
			player.Emit("discord:Show");
			player.Model = (uint)PedModel.FreemodeMale01;
			player.Spawn(new AltV.Net.Data.Position(0, 0, 72), 0);
			player.Health = 200;
		}

		[ScriptEvent(ScriptEventType.PlayerDisconnect)]
		public void OnPlayerDisconnect(MyPlayer player, string reason) {
			Logger.LogColored(new string[] {
				"[","-", "] ",
				$"{player.Name}"
			}, new ConsoleColor[] {
				ConsoleColor.Gray, ConsoleColor.DarkRed, ConsoleColor.Gray, ConsoleColor.DarkYellow
			});
		}
	}
}
