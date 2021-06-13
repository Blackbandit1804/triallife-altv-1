using AltV.Net.Data;
using System;

namespace core.Usefull {
	public static class Utils {

		public static Position GetRandomPositionInRange(Position position, float range) {
			Random random = new Random();
			float x = position.X + (float)random.NextDouble() * (range * 2) - range;
			float y = position.Y + (float)random.NextDouble() * (range * 2) - range;
			return new Position(x, y, position.Z);
		}
	}
}
