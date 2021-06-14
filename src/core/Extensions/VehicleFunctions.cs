using core.Factories;
using core.Usefull;
using System.Collections.Generic;
using static core.Usefull.Enums;

namespace core.Extensions {
	public class Getter {
		public static LockState lockState(MyVehicle vehicle) {
			return vehicle.tlrpLockState;
		}
		public static bool hasFuel(MyVehicle vehicle) {
			if (Utils.isFlagEnabled(vehicle.behavior, VehicleBehavior.UNLIMITED_FUEL)) return true;
			return vehicle.fuel > 0.0;
		}
		public static bool isOwner(MyVehicle vehicle, MyPlayer player) {
			if (vehicle.playerId == 0) return true;
			return vehicle.playerId == player.Id;
		}
	}
	public class Keys {
		public static bool give(MyVehicle vehicle, MyPlayer player) {
			if (vehicle.keys == null) vehicle.keys = new List<string>();
			var index = vehicle.keys.FindIndex(x => x == player.data.id.ToString());
			if (index != -1) return true;
			vehicle.SetStreamSyncedMetaData(Vehicle_State.KEYS, v.keys);
		}
	}
}
