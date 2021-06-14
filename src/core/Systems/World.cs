using core.configs;
using core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace core.Systems {
	public class World {
		private static float worldDivision = 6, maxY = 8000, minY = -2000;
		private static Timer worldTimer = new Timer() { AutoReset = true, Enabled = false, Interval = 60000 };
		private static List<(float, float)> minMaxGroups = new List<(float, float)>();
		public static int hour = DefaultConfig.BOOTUP_HOUR;
		public static int minute = DefaultConfig.BOOTUP_MINUTE;

		public static void init() {
			generateGrid(worldDivision);
			worldTimer.Start();
		}
		public static void generateGrid(float division) {
			var total = maxY + Math.Abs(minY);
			for (int i = 0; i < division; i++) {
				minMaxGroups.Add((maxY - 2000 - (total / division) * i, maxY - (total / division) * i));
			}
		}
		public static void updateWorldTime() {
			minute += DefaultConfig.MINUTES_PER_MINUTE;
			if (minute >= 60) {
				minute = 0;
				hour += 1;
				var lastIndex = DefaultConfig.WEATHER_ROTATION.Count - 1;
				var endElement = DefaultConfig.WEATHER_ROTATION[lastIndex];
				DefaultConfig.WEATHER_ROTATION.RemoveAt(lastIndex);
				DefaultConfig.WEATHER_ROTATION.Insert(0, endElement);
			}
			if (hour >= 24) hour = 0;
		}
		public static int getGridSpace(MyPlayer player) {
			var gridSpace = minMaxGroups.FindIndex(data => player != null && player.Exists && player.Position.Y > data.Item1 && player.Position.Y < data.Item2);
			return Math.Max(0, gridSpace);
		}
		public static string getWeatherByGrid(int gridSpace) {
			return DefaultConfig.WEATHER_ROTATION[gridSpace];
		}
	}
}
