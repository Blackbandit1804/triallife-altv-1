using AltV.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using triallife.Database.Models;
using triallife.Factories;

namespace triallife.Events {
	public class Discord_Events : IScript {

		[ClientEvent("discord:Begin")]
		public static void OnDiscordBeging(MyPlayer player) {

		}

		[ClientEvent("discord:FinishAuth")]
		public static void OnDiscordFinishAuth(MyPlayer player, DiscordUser discord) {
			var player_identifier = player.discordToken;
			if (string.IsNullOrEmpty(player_identifier)) return;
		}
	}
}
