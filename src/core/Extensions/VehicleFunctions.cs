using AltV.Net;
using AltV.Net.Data;
using core.configs;
using core.Factories;
using core.Usefull;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using static core.Usefull.Enums;
using static BCrypt.BCryptHelper;

namespace core.vehicleFuncs {
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
			if (vehicle.keys.Contains(player.data.id.ToString())) return true;
			vehicle.keys.Add(player.data.id.ToString());
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.KEYS), vehicle.keys);
			return true;
		}
		public static bool has(MyVehicle vehicle, MyPlayer player) {
			if (vehicle.keys == null) vehicle.keys = new List<string>();
			return vehicle.keys.Contains(player.data.id.ToString());
		}
		public static bool remove(MyVehicle vehicle, MyPlayer player) {
			if (vehicle.keys == null) vehicle.keys = new List<string>();
			if (!vehicle.keys.Contains(player.data.id.ToString())) return true;
			vehicle.keys.RemoveAt(vehicle.keys.FindIndex(x => x == player.data.id.ToString()));
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.KEYS), vehicle.keys);
			return true;
		}
	}
	public class Create {
		private static VehicleBehavior ownerbehavior = VehicleBehavior.CONSUMES_FUEL | VehicleBehavior.NEED_KEY_TO_START;
		private static VehicleBehavior tmpbehavior = VehicleBehavior.NO_KEY_TO_LOCK | VehicleBehavior.NO_KEY_TO_START | VehicleBehavior.UNLIMITED_FUEL | VehicleBehavior.NO_SAVE;
		public static MyVehicle add(MyPlayer player, Database.Vehicle data) {
			data.uid = HashPassword(JsonConvert.SerializeObject(player.data), GenerateSalt(BCrypt.SaltRevision.Revision2B));
			if (player.data.vehicles == null) player.data.vehicles = new List<Database.Vehicle>() { data };
			else player.data.vehicles.Add(data);
			playerFuncs.Save.field(player, "vehicles", player.data.vehicles);
			playerFuncs.Sync.vehicles(player);
			return spawn(player, data);
		}
		public static bool remove(MyPlayer player, string uid) {
			if (player.data.vehicles == null) return false;
			var index = player.data.vehicles.FindIndex(v => v.uid == uid);
			if (index == -1) return false;
			player.data.vehicles.RemoveAt(index);
			playerFuncs.Save.field(player, "vehicles", player.data.vehicles);
			playerFuncs.Sync.vehicles(player);
			return true;
		}
		public static bool despawn(int id, MyPlayer player) {
			var vehicle = Alt.GetAllVehicles().FirstOrDefault(x => x.Id == id);
			if (vehicle == null) return false;
			if (vehicle.Exists) {
				player.Emit(Utils.GetDescription(TlrpEvent.VEHICLE_DESPAWNED), vehicle);
				vehicle.Remove();
			}
			if (player != null && player.Exists) player.lastVehicleID = 0;
			return true;
		}
		public static MyVehicle tempVehicle(MyPlayer player, string model, Position pos, Rotation rot) {
			var vehicle = new MyVehicle(Alt.Hash(model), pos, rot);
			vehicle.playerId = player.Id;
			vehicle.behavior = tmpbehavior;
			vehicle.NumberplateText = "MGCOMDE";
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.OWNER), vehicle.playerId);
			return vehicle;
		}
		public static MyVehicle spawn(MyPlayer player, Database.Vehicle data) {
			if (player.lastVehicleID != 0) {
				var vehicle = Alt.GetAllVehicles().FirstOrDefault(v => v.Id == player.lastVehicleID);
				if (vehicle != null & vehicle.Exists) vehicle.Remove();
			}
			var newVehicle = new MyVehicle(Alt.Hash(data.model), data.position, data.rotation);
			player.lastVehicleID = newVehicle.Id;
			data.fuel = 100.0;
			newVehicle.data = data;
			newVehicle.fuel = data.fuel;
			newVehicle.playerId = player.Id;
			newVehicle.behavior = ownerbehavior;
			var color = new Color() { r = 255, g = 255, b = 255, a = 255 };
			if (data.color != null) color = data.color;
			newVehicle.PrimaryColorRgb = new Rgba((byte)color.r, (byte)color.g, (byte)color.b, (byte)color.a);
			newVehicle.SecondaryColorRgb = new Rgba((byte)color.r, (byte)color.g, (byte)color.b, (byte)color.a);
			newVehicle.NumberplateText = data.plate;
			newVehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.OWNER), newVehicle.playerId);
			player.Emit(Utils.GetDescription(TlrpEvent.VEHICLE_SPAWNED), newVehicle);
			return newVehicle;
		}
	}
	public class Save {
		public static void data(MyPlayer owner, MyVehicle vehicle) {
			if (Utils.isFlagEnabled(vehicle.behavior, VehicleBehavior.NO_SAVE)) return;
			if (vehicle.data == null) return;

		}
	}
	public class Setter {
		public static bool locked(MyVehicle vehicle, MyPlayer player, LockState lockState) {
			if (Utils.isFlagEnabled(vehicle.behavior, VehicleBehavior.NO_KEY_TO_LOCK)) {
				if (!Getter.isOwner(vehicle, player) && !Keys.has(vehicle, player)) return false;
			}
			vehicle.tlrpLockState = lockState;
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.LOCK_STATE), vehicle.tlrpLockState);
			if (vehicle.tlrpLockState == LockState.LOCKED) {
				for (int i = 0; i < 6; i++) {
					doorOpen(vehicle, player, i, false);
				}
			}
			return true;
		}
		public static void doorOpen(MyVehicle vehicle, MyPlayer player, int index, bool state, bool bypass = false) {
			if (!Utils.isFlagEnabled(vehicle.BodyHealth, (uint)VehicleBehavior.NO_KEY_TO_LOCK) && !bypass) {
				if (!Getter.isOwner(vehicle, player) && !Keys.has(vehicle, player) && Getter.lockState(vehicle) != LockState.UNLOCKED) return;
			}
			var doorName = $"Door_{Enum.GetName((VehicleDoor)index)}";
			var stateName = (VehicleState)Enum.Parse(typeof(VehicleState), doorName);
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(stateName), state);
		}
		public static void updateFuel(MyVehicle vehicle) {
			if (Utils.isFlagEnabled(vehicle.behavior, VehicleBehavior.UNLIMITED_FUEL)) {
				vehicle.fuel = 100;
				vehicle.SetSyncedMetaData(Utils.GetDescription(VehicleState.FUEL), vehicle.fuel);
				return;
			}
			if (!vehicle.engineStatus) {
				vehicle.SetSyncedMetaData(Utils.GetDescription(VehicleState.FUEL), vehicle.fuel);
				return;
			}
			vehicle.fuel = vehicle.data.fuel;
			vehicle.fuel = Math.Max(0, vehicle.fuel - DefaultConfig.FUEL_LOSS_PER_PLAYER_TICK);
			if (vehicle.fuel == 0) Toggle.engine(vehicle, null, true);
			vehicle.data.fuel = vehicle.fuel;
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.FUEL), vehicle.data.fuel);
			var owner = (MyPlayer)Alt.GetAllPlayers().FirstOrDefault(x => x.Id == vehicle.playerId);
			if (owner == null || !owner.Exists) { 
				vehicle.Remove();
				return;
			}
			if (DateTime.Now.Ticks > vehicle.nextSave) {
				Save.data(owner, vehicle);
				vehicle.nextSave = DateTime.Now.AddMilliseconds(new Random().Next(10000, 30000)).Ticks;
			}
		}
	}
	public class Toggle {
		public static LockState locked(MyVehicle vehicle, MyPlayer player, bool bypass = false) { 
			if (!bypass) {
				if (!Getter.isOwner(vehicle, player) && !Keys.has(vehicle, player)) {
					return vehicle.tlrpLockState;
				}
			}
			var LockStates = new LockState[] { LockState.UNLOCKED, LockState.LOCKED };
			var index = LockStates.ToList().FindIndex(x => x == vehicle.tlrpLockState);
			if (index + 1 == LockStates.Length) index = -1;
			vehicle.tlrpLockState = LockStates[index + 1];
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.LOCK_STATE), vehicle.tlrpLockState);
			if (vehicle.tlrpLockState == LockState.LOCKED) {
				for (int i = 0; i < 6; i++) Setter.doorOpen(vehicle, player, i, false);
			}
			Alt.Emit(Utils.GetDescription(TlrpEvent.VEHICLE_LOCK), vehicle);
			return vehicle.tlrpLockState;
		}
		public static void engine(MyVehicle vehicle, MyPlayer player, bool bypass = false) {
			if (Utils.isFlagEnabled(vehicle.behavior, VehicleBehavior.NEED_KEY_TO_START) && !bypass) {
				if(!Getter.isOwner(vehicle, player) && !Keys.has(vehicle, player))
					return;
			}
			if (!Getter.hasFuel(vehicle)) {
				vehicle.engineStatus = false;
				vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.ENGINE), vehicle.engineStatus);
				playerFuncs.Emit.notification(player, "Der Tank des Fahrzeuges ist leer");
				return;
			}

			vehicle.engineStatus = !vehicle.engineStatus;
			vehicle.SetStreamSyncedMetaData(Utils.GetDescription(VehicleState.ENGINE), vehicle.engineStatus);
			if (player.Exists) {
				var status = vehicle.engineStatus switch { true => "AN", _ => "AUS" };
				playerFuncs.Emit.notification(player, $"Motor ~y~ {status}");
			}
			Alt.Emit(Utils.GetDescription(TlrpEvent.VEHICLE_ENGINE), vehicle);
		}
	}
	public class Utility {
		public static void eject(MyVehicle vehicle, MyPlayer player) {
			if (player.Vehicle == null || (MyVehicle)player.Vehicle != vehicle) return;
			playerFuncs.Safe.setPosition(player, player.Position.X, player.Position.Y, player.Position.Z);
		}
		public static void repair(MyVehicle vehicle) {
			vehicle.Repair();
			Setter.doorOpen(vehicle, null, (int)VehicleDoor.HOOD, false, true);
			Alt.Emit(Utils.GetDescription(TlrpEvent.VEHICLE_REPAIRED), vehicle);
		}
		public static void warpInto(MyVehicle vehicle, MyPlayer player, VehicleSeat seat) {
			if (vehicle.Driver != null) return;
			if ((MyPlayer)vehicle.Driver == player) return;
			if (player == null || !player.Exists) return;
			player.Emit(Utils.GetDescription(VehicleEvent.SET_INTO), vehicle, seat);
		}
	}
}
