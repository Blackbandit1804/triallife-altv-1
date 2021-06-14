using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using core.Factories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using static core.Usefull.Enums;

namespace core.Usefull {
	public class Utils {
		public static Position GetRandomPositionInRange(Position position, float range) {
			Random random = new Random();
			float x = position.X + (float)random.NextDouble() * (range * 2) - range;
			float y = position.Y + (float)random.NextDouble() * (range * 2) - range;
			return new Position(x, y, position.Z);
		}
		public static string GetDescription(SystemEvent value) {
			FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
			DescriptionAttribute[] attributes = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
			try { return attributes.First().Description; } catch (Exception) { return string.Empty; }
		}
		public static string GetDescription(ViewEvent value) {
			FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
			DescriptionAttribute[] attributes = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
			try { return attributes.First().Description; } catch (Exception) { return string.Empty; }
		}
		public static string GetDescription(InventoryType value) {
			FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
			DescriptionAttribute[] attributes = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
			try { return attributes.First().Description; } catch (Exception) { return string.Empty; }
		}
		public static string GetDescription(TlrpEvent value) {
			FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
			DescriptionAttribute[] attributes = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
			try { return attributes.First().Description; } catch (Exception) { return string.Empty; }
		}
		public static string GetDescription(VehicleState value) {
			FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
			DescriptionAttribute[] attributes = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
			try { return attributes.First().Description; } catch (Exception) { return string.Empty; }
		}
		public static string GetDescription(VehicleEvent value) {
			FieldInfo fieldInfo = value.GetType().GetField(value.ToString());
			DescriptionAttribute[] attributes = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];
			try { return attributes.First().Description; } catch (Exception) { return string.Empty; }
		}
		public static List<MyPlayer> getClosestPlayers(MyPlayer player, float distance) {
			var elements = new List<IEntity>();
			Alt.GetAllPlayers().ToList().ForEach(target => elements.Add(target));
			var players = getClosestTypes<MyPlayer>(player.Position, elements, distance, new List<string>() { "data", "discord", "accountData" });
			return players;
		}
		private static List<T> getClosestTypes<T>(Position position, List<IEntity> elements, float maxDistance, List<string> mustHaveproperties, string positionName = "pos") {
			var newElements = new List<T>();
			for (int i = 0; i < elements.Count; i++) {
				if (elements[i] == null || !elements[i].Exists) continue;
				var elementData = ToDictionary(elements[i]);
				if (mustHaveproperties.Count >= 1) {
					var isValid = true;
					for (int x = 0; x < mustHaveproperties.Count; x++) {
						if (elementData[mustHaveproperties[i]] == null) {
							isValid = false;
							break;
						}
					}
					if (!isValid) continue;
				}
				if (position.Distance(elements[i].Position) > maxDistance) continue;
				newElements.Add(ToObject<T>(elementData));
			}
			return newElements;
		}
		public static bool isFlagEnabled<T>(T flag, T flagToCheck) {
			var currentFlag = Convert.ToInt32(flag);
			var currentFlagToCheck = Convert.ToInt32(flagToCheck);
			return (currentFlag & currentFlagToCheck) != 0;
		}
		public static bool isFlagEnabled(int flag, int flagToCheck) {
			return (flag & flagToCheck) != 0;
		}
		public static T deepCloneObject<T>(object data) {
			return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(data));
		}
		public static int stripCategory(string value) {
			return Convert.ToInt32(value.Substring(value.IndexOf("-") + 1));
		}
		public static Dictionary<string, object> ToDictionary<T>(T data) {
			var json = JsonConvert.SerializeObject(data);
			return JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
		}
		public static T ToObject<T>(Dictionary<string, object> data) {
			var json = JsonConvert.SerializeObject(data);
			return JsonConvert.DeserializeObject<T>(json);
		}
		public static bool inLockState(LockState state) {
			if (state == LockState.LOCKED || state == LockState.LOCKOUT_PLAYER) return true;
			return false;
		}
	}
}
