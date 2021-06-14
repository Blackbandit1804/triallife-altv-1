using core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Usefull {
	public class Encryption {
		public static string getUniquePlayerHash(MyPlayer player, string discord) {
			return BCrypt.BCryptHelper.HashPassword($"{player.HardwareIdHash}{player.HardwareIdExHash}{player.Ip}{discord}{player.SocialClubId}", BCrypt.BCryptHelper.GenerateSalt(BCrypt.SaltRevision.Revision2B));
		}
	}
}
