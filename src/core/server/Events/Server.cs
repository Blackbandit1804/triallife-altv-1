using AltV.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using triallife.Factories;

namespace triallife.Events {
	public class Server : IScript {
		private bool isServerReady = false;

		[ScriptEvent(ScriptEventType.PlayerConnect)]
		public void OnPlayerConnect(MyPlayer player, string reason) {
			if (player == null || !player.Exists) return;
			if (!isServerReady) player.Kick("Der Server ist noch am aufwärmen ;)");
		}
	}
}
