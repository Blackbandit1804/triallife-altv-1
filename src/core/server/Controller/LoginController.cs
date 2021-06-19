using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using triallife.Database.Models;
using triallife.Factories;

namespace triallife.Controller {
	public class LoginController {

		public static async Task tryLogin(MyPlayer player, DiscordUser data, Account account) {
			player.pendingLogin = false;
			player.discordToken = string.Empty;
		}
	}
}
