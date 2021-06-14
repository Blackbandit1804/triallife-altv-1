using AltV.Net.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.configs {
	public class DefaultConfig {
		public static bool WHITELIST { get; set; } = false;
		public static bool USE_DISCORD_BOT { get; set; } = false;
		public static bool VOICE_ON { get; set; } = false;
		public static float VOICE_MAX_DISTANCE { get; set; } = 32.0f;
		public static Position CHARACTER_SELECT_POS { get; set; } = new Position(36.19486618041992f, 859.3850708007812f, 197.71343994140625f);
		public static Rotation CHARACTER_SELECT_ROT { get; set; } = new Rotation(0, 0, -0.1943807601928711f);
		public static int PLAYER_MAX_CHARACTER_SLOTS { get; set; } = 5;
		public static Position CHARACTER_CREATOR_POS { get; set; } = new Position(-673.5911254882812f, -227.51573181152344f, 37.090972900390625f);
		public static Rotation CHARACTER_CREATOR_ROT { get; set; } = new Rotation(0, 0, 1.302026629447937f);
		public static Position PLAYER_NEW_SPAWN_POS { get; set; } = new Position(-867.1437377929688f, -172.6201934814453f, 37.799232482910156f);
		public static int PLAYER_CASH { get; set; } = 500;
		public static int PLAYER_BANK { get; set; } = 4500;
		public static int RESPAWN_TIME { get; set; } = 180000;
		public static bool RESPAWN_LOSE_WEAPONS { get; set; } = true;
		public static double RESPAWN_HEALTH { get; set; } = 3500;
		public static int RESPAWN_ARMOUR { get; set; } = 0;
		public static float MAX_INTERACTION_DISTANCE { get; set; } = 3;
		public static int BOOTUP_HOUR { get; set; } = 9;
		public static int BOOTUP_MINUTE { get; set; } = 0;
		public static int MINUTES_PER_MINUTE { get; set; } = 5;
		public static int TIME_BETWEEN_INVENTORY_UPDATES { get; set; } = 10000;
		public static int TIME_BETWEEN_FOOD_UPDATES { get; set; } = 10000;
		public static double WATER_REMOVAL_RATE { get; set; } = 0.08;
		public static double FOOD_REMOVAL_RATE { get; set; } = 0.05;
		public static double MOOD_REMOVAL_RATE { get; set; } = 0.01;
		public static List<Position> VALID_HOSPITALS { get; set; } = new List<Position>() { 
			new Position(-248.01309204101562f, 6332.01513671875f, 33.0750732421875f),
			new Position(1839.15771484375f, 3672.702392578125f, 34.51904296875f),
			new Position(297.4647521972656f, -584.7089233398438f, 44.292724609375f),
			new Position(-677.0172119140625f, 311.7821350097656f, 83.601806640625f),
			new Position(1151.2904052734375f, -1529.903564453125f, 36.3017578125f),
		};
		public static List<string> WEATHER_ROTATION { get; set; } = new List<string>() { 
			"EXTRASUNNY",
			"EXTRASUNNY",
			"CLEAR",
			"CLOUDS",
			"OVERCAST",
			"RAIN",
			"THUNDER",
			"RAIN",
			"FOGGY",
			"OVERCAST",
			"CLEARING" 
		};
		public static int TIME_BETWEEN_VEHICLE_UPDATES { get; set; } = 10000;
		public static int TIME_BETWEEN_VEHICLE_SAVES { get; set; } = 30000;
		public static float FUEL_LOSS_PER_PLAYER_TICK { get; set; } = 0.15f;
		public Dictionary<string, Position> VEHICLE_DEALERSHIP_SPAWNS { get; set; } = new Dictionary<string, Position>() {
			{ "boat", new Position(-877.33532714f, -1357.1688f, 4.0053f) },
			{"speedboat", new Position(-877.3353f, -1357.1688f, 4.0053f) },
			{"commercial", new Position(1270.839f, -3211.8981f, 5.9010f) },
			{"compact", new Position(-11.3566274f, -1085.3214f, 26.691f) },
			{"coupe", new Position(-11.356627464f, -1085.3214f, 26.691f) },
			{"cycle", new Position(-1105.5673828f, -1688.4227f, 4.3033f) },
			{"emergency", new Position(419.75384f, -1024.2294f, 29.041f) },
			{"industrial", new Position(1270.839f, -3211.8981f, 5.9010f) },
			{"military", new Position(-2246.8747f, 3245.73217f, 32.810f) },
			{"motorcycle", new Position(1770.909f, 3341.88378f, 41.185f) },
			{"muscle", new Position(-230.7952728f, -1388.4603f, 31.258f) },
			{"offroad", new Position(1981.775146f, 3776.67968f, 32.180f) },
			{"aircraft", new Position(-1052.5650f, -2964.5654f, 18.818f) },
			{"suv", new Position(-11.35662746429f, -1085.3214f, 26.691f) },
			{"sedan", new Position(-11.356627464f, -1085.3214f, 26.691f) },
			{"service", new Position(419.7538452f, -1024.2294f, 29.041f) },
			{"sport", new Position(-11.356627464f, -1085.3214f, 26.691f) },
			{"sportclassic", new Position(-11.35f, -1085.3214f, 26.691f) },
			{"super", new Position(-11.356627464f, -1085.3214f, 26.691f) },
			{"trailer", new Position(1270.839599f, -3211.8981f, 5.9010f) },
			{"train", new Position(0, 0, 0) },
			{"utility", new Position(1270.839599f, -3211.8981f, 5.9010f) },
			{"van", new Position(-230.7952728271f, -1388.4603f, 31.258f) }
		};
	}
}
