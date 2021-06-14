using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.Enums;
using core.configs;
using core.Database;
using core.Factories;
using core.Systems;
using core.Usefull;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static core.Usefull.Enums;

namespace core.extensions {
	public class Economy {
		public static bool add(MyPlayer player, EconomyType type, double amount) {
			amount = Math.Min(Math.Max(0, amount), double.MaxValue);
			try {
				double originalValue = type switch { EconomyType.Bank => player.data.bank, _ => player.data.cash };
				if (type.Equals(EconomyType.Bank)) {
					player.data.bank += amount;
					if (originalValue > player.data.bank) {
						player.data.bank = originalValue;
						return false;
					}
				} else if (type.Equals(EconomyType.Cash)) {
					player.data.cash += amount;
					if (originalValue > player.data.cash) {
						player.data.cash = originalValue;
						return false;
					}
				}
				//emit & save data
				return true;
			} catch (Exception) { return false; }
		}
		public static bool sub(MyPlayer player, EconomyType type, double amount) {
			amount = Math.Min(Math.Max(0, amount), double.MaxValue);
			try {
				double originalValue = type switch { EconomyType.Bank => player.data.bank, _ => player.data.cash };
				if (type.Equals(EconomyType.Bank)) {
					player.data.bank -= amount;
					if (player.data.bank > originalValue) {
						player.data.bank = originalValue;
						return false;
					}
				} else if (type.Equals(EconomyType.Cash)) {
					player.data.cash -= amount;
					if (player.data.cash > originalValue) {
						player.data.cash = originalValue;
						return false;
					}
				}
				//emit & save data
				return true;
			} catch (Exception) { return false; }
		}
	}

	public class Updater {
		public static void init(MyPlayer player, Character data = null) {
			player.data = new Character() {
				position = DefaultConfig.PLAYER_NEW_SPAWN_POS,
				cash = DefaultConfig.PLAYER_CASH,
				bank = DefaultConfig.PLAYER_BANK,
				design = null,
				info = null,
				hunger = 100.0,
				thirst = 100.0,
				mood = 100.0,
				isUnconscious = false,
				armour = 0,
				hours = 0,
				vehicles = new List<Database.Vehicle>()
			};
			if (data != null) {
				var charData = Utils.ToDictionary(data);
				var playerData = Utils.ToDictionary(player.data);
				charData.ToList().ForEach(keyValuePair => playerData[keyValuePair.Key] = keyValuePair.Value);
				player.data = Utils.ToObject<Character>(playerData);
			}
		}

		public static void updateByKeys(MyPlayer player, Dictionary<string, object> dataObject, string targetDataName = "") {
			dataObject.ToList().ForEach(keyValuePair => { 
				if (!string.IsNullOrEmpty(targetDataName)) {
					((player.data as IDictionary<string, object>)[targetDataName] as IDictionary<string, object>)[keyValuePair.Key] = keyValuePair.Value;
				} else {
					(player.data as IDictionary<string, object>)[keyValuePair.Key] = keyValuePair.Value;
				}
			});
		}
	}

	public class Emit {
		public static void animation(MyPlayer player, string dictionary, string name, AnimationFlag flags, int duration) {
			if (player.data.isUnconscious) {
				Logger.LogColored(
					new string[] { "[", "3L:RP", "] Cannot play ", $"{dictionary}@{name} ", "while player is unconscious" },
					new ConsoleColor[] { ConsoleColor.Gray, ConsoleColor.Green, ConsoleColor.Gray, ConsoleColor.DarkCyan, ConsoleColor.Gray }
				);
				return;
			}
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_EMIT_ANIMATION), dictionary, name, flags, duration);
		}

		public static void audioStream(AudioStream stream) {
			Alt.EmitAllClients(Utils.GetDescription(SystemEvent.PLAYER_EMIT_AUDIO_STREAM), stream);
		}

		public static void meta(MyPlayer player, string key, object value) {
			player.Emit(Utils.GetDescription(SystemEvent.META_SET), key, value);
		}

		public static void message(MyPlayer player, string message) {
			player.Emit(Utils.GetDescription(ViewEvent.Hud_AppendMessage), message);
		}

		public static void notification(MyPlayer player, string message) {
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_EMIT_NOTIFICATION), message);
		}

		public static void particle(MyPlayer player, Particle particle, bool emitToNearbyPlayers = false) {
			if (!emitToNearbyPlayers) {
				player.Emit(Utils.GetDescription(SystemEvent.PLAY_PARTICLE_EFFECT), particle);
				return;
			}
			var nearbyPlayers = Utils.getClosestPlayers(player, 10f);
			nearbyPlayers.ForEach(target => target.Emit(Utils.GetDescription(SystemEvent.PLAY_PARTICLE_EFFECT), particle));
		}

		public static void createProgressbar(MyPlayer player, ProgressBar progressBar) {
			player.Emit(Utils.GetDescription(SystemEvent.PROGRESSBAR_CREATE), progressBar);
		}

		public static void removeProgressbar(MyPlayer player, string uid) {
			player.Emit(Utils.GetDescription(SystemEvent.PROGRESSBAR_REMOVE), uid);
		}

		public static void sound2D(MyPlayer player, string audioName, float volume = 0.35f) {
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_EMIT_SOUND_2D), audioName, volume);
		}

		public static void sound3D(MyPlayer player, string audioName, Entity target) {
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_EMIT_SOUND_3D), target, audioName);
		}

		public static void taskTimeline(MyPlayer player, List<TaskCallback> tasks) {
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_EMIT_TASK_TIMELINE), tasks);
		}

		public static void taskTimeline(MyPlayer player, List<core.Usefull.Task> tasks) {
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_EMIT_TASK_TIMELINE), tasks);
		}
	}

	public class Inventory {
		public static (int, int) getFreeInventorySlot(MyPlayer player, int tabNumber = -1) {
			for (int i = 0; i < player.data.inventory.Count; i++) {
				if (tabNumber != -1 && i != tabNumber) continue;
				var tab = player.data.inventory[i];
				if (tab.Count >= 28) continue;
				for (int x = 0; x < 27; x++) {
					var itemIndex = tab.FindIndex(item => item.slot == x);
					if (itemIndex >= 0) continue;
					return (i, x);
				}
			}
			return (-1, -1);
		} 
		public static bool hasItem(MyPlayer player, Item item) {
			var hasInInventory = isInInventory(player, item);
			if (hasInInventory.Item1 != -1) return true;
			var hasInToolbar = isInToolbar(player, item);
			if (hasInToolbar != -1) return true;
			return false;
		}
		public static Item hasWeapon(MyPlayer player) {
			for (int t = 0; t < player.data.inventory.Count; t++) {
				var tab = player.data.inventory[t];
				if (tab.Count <= 28) continue;
				for (int i = 0; i < tab.Count; i++) {
					var inventoryItem = tab[i];
					if (inventoryItem == null) continue;
					if (inventoryItem.data == null) continue;
					if (!inventoryItem.data.ContainsKey("hash") || inventoryItem.data["hash"] == null) continue;
					if (!Utils.isFlagEnabled(inventoryItem.behavior, ItemType.IS_WEAPON)) continue;
					return inventoryItem;
				}
			}
			for (int i = 0; i < player.data.toolbar.Count; i++) {
				var item = player.data.toolbar[i];
				if (item == null) continue;
				if (item.data == null) continue;
				if (!item.data.ContainsKey("hash") || item.data["hash"] == null) continue;
				if (!Utils.isFlagEnabled(item.behavior, ItemType.IS_WEAPON)) continue;
				return item;
			}
			return null;
		}
		public static Item getInventoryItem(MyPlayer player, int slot, int tab) {
			if (tab >= 6) return null;
			if (slot >= 28) return null;
			var index = player.data.inventory[tab].FindIndex(item => item.slot == slot);
			if (index == -1) return null;
			return Utils.deepCloneObject<Item>(player.data.inventory[tab][index]);
		}
		public static bool replaceInventoryItem(MyPlayer player, Item item, int tab) {
			var itemIndex = player.data.inventory[tab].FindIndex(x => x.slot == item.slot);
			if (itemIndex == -1) return false;
			player.data.inventory[tab][itemIndex] = item;
			return true;
		}
		public static Item getEquipmentItem(MyPlayer player, int slot) {
			if (slot >= 11) return null;
			var index = player.data.equipment.FindIndex(item => item.slot == slot);
			if (index == -1) return null;
			return Utils.deepCloneObject<Item>(player.data.equipment[index]);
		}
		public static Item getToolbarItem(MyPlayer player, int slot) {
			if (slot >= 5) return null;
			var index = player.data.toolbar.FindIndex(item => item.slot == slot);
			if (index == -1) return null;
			return Utils.deepCloneObject<Item>(player.data.toolbar[index]);
		}
		public static (int, int) isInInventory(MyPlayer player, Item item) { 
			for (int t = 0; t < player.data.inventory.Count; t++) {
				var tab = player.data.inventory[t];
				if (tab.Count <= 0) continue;
				for (int i = 0; i < tab.Count; i++) {
					var inventoryItem = tab[i];
					if (item == null) continue;
					var objectKeys = item as IDictionary<string, object>;
					var keyIndex = objectKeys.ToList().FindIndex(keyValuePair => keyValuePair.Value == (inventoryItem as IDictionary<string, object>)[keyValuePair.Key]);
					if (keyIndex == -1) continue;
					return (t, i); 
				}
			}
			return (-1, -1);
		}
		public static int isInEquipment(MyPlayer player, Item item) {
			if (player.data.equipment.Count <= 0) return -1;
			if (item == null) throw new Exception("[3L:RP] Specified item is null for isInEquipment");
			for (int i = 0; i < player.data.equipment.Count; i++) {
				var inventoryItem = player.data.equipment[i];
				if (item == null) continue;
				var objectKeys = item as IDictionary<string, object>;
				var keyIndex = objectKeys.ToList().FindIndex(keyValuePair => keyValuePair.Value == (inventoryItem as IDictionary<string, object>)[keyValuePair.Key]);
				if (keyIndex == -1) continue;
				return i;
			}
			return -1;
		}
		public static bool isEquipmentSlotFree(MyPlayer player, int slot) {
			if (slot >= 11) return false;
			if (player.data.equipment.Count <= 0) return true;
			return player.data.equipment.FindIndex(item => item.slot == slot) == -1;
		}
		public static bool isInventorySlotFree(MyPlayer player, int slot, int tab) {
			if (tab >= 6) return false;
			if (slot >= 28) return false;
			var index = player.data.inventory[tab].FindIndex(item => item.slot == slot);
			return index == -1;
		}
		public static bool inventoryAdd(MyPlayer player, Item item, int slot, int tab) {
			if (tab >= 6) return false;
			if (slot >= 28) return false;
			if (player.data.inventory[tab] == null) return false;
			var index = player.data.inventory[tab].FindIndex(item => item.slot == slot);
			if (index != -1) return false;
			if (item.slot != slot) item.slot = slot;
			var safeItemCopy = Utils.deepCloneObject<Item>(item);
			player.data.inventory[tab].Add(safeItemCopy);
			return true;
		}
		public static bool inventoryRemove(MyPlayer player, int slot, int tab) {
			if (slot >= 28) return false;
			if (tab >= 6) return false;
			if (player.data.inventory[tab] == null) return false;
			var index = player.data.inventory[tab].FindIndex(item => item.slot == slot);
			if (index == -1) return false;
			player.data.inventory[tab].RemoveAt(index);
			return true;
		}
		public static bool equipmentRemove(MyPlayer player, int slot) {
			if (slot >= 11) return false;
			var index = player.data.equipment.FindIndex(item => item.slot == slot);
			if (index == -1) return false;
			player.data.equipment.RemoveAt(index);
			return true;
		}
		public static bool isEquipmentSlotValid(Item item, EquipmentType slot) {
			if ((int)slot >= 11) return false;
			if (item.equipment != slot) return false;
			return true;
		}
		public static bool equipmentAdd(MyPlayer player, Item item, int slot) {
			if (slot >= 11) return false;
			if (!isEquipmentSlotFree(player, slot)) return false;
			if ((int)item.equipment != slot) return false;
			var safeItemCopy = Utils.deepCloneObject<Item>(item);
			player.data.equipment.Add(safeItemCopy);
			return true;
		}
		public static bool isToolbarSlotFree(MyPlayer player, int slot) {
			if (slot >= 5) return false;
			if (player.data.toolbar.Count >= 5) return false;
			return player.data.toolbar.FindIndex(item => item.slot == slot) == -1;
		} 
		public static bool toolbarAdd(MyPlayer player, Item item, int slot) {
			if (slot >= 5) return false;
			if (!isToolbarSlotFree(player, slot)) return false;
			if (item.slot != slot) item.slot = slot;
			var safeItemCopy = Utils.deepCloneObject<Item>(item);
			player.data.toolbar.Add(safeItemCopy);
			return true;
		}
		public static bool toolbarRemove(MyPlayer player, int slot) {
			if (slot >= 5) return false;
			var index = player.data.toolbar.FindIndex(item => item.slot == slot);
			if (index == -1) return false;
			player.data.toolbar.RemoveAt(index);
			return true;
		}
		public static bool replaceToolbarItem(MyPlayer player, Item item) {
			var itemIndex = player.data.toolbar.FindIndex(x => item.slot == x.slot);
			if (itemIndex == -1) return false;
			player.data.toolbar[itemIndex] = item;
			return true;
		}
		public static int isInToolbar(MyPlayer player, Item item) {
			if (player.data.toolbar.Count == 0) return -1;
			if (item == null) throw new Exception("[3L:RP] Specified item is null for isInToolbar");
			for (int i = 0; i < player.data.toolbar.Count; i++) {
				var toolbarItem = player.data.toolbar[i];
				if (toolbarItem == null) continue;
				var objectKeys = item as IDictionary<string, object>;
				var keyIndex = objectKeys.ToList().FindIndex(keyValuePair => keyValuePair.Value == (toolbarItem as IDictionary<string, object>)[keyValuePair.Key]);
				if (keyIndex == -1) continue;
				return i;
			}
			return -1;
		}
		public static bool findAndRemove(MyPlayer player, string itemName) {
			var toolbarIndex = isInToolbar(player, new Item() { name = itemName });
			if (toolbarIndex != -1) {
				var item = player.data.toolbar[toolbarIndex];
				if (item == null) return false;
				var removedFromToolbar = toolbarRemove(player, item.slot);
				if (!removedFromToolbar) return false;
				Save.field(player, "toolbar", player.data.inventory);
				Sync.inventory(player);
				return true;
			}
			var inventoryIndex = isInInventory(player, new Item() { name = itemName });
			if (inventoryIndex.Item1 == -1) return false;
			var invItem = player.data.inventory[inventoryIndex.Item1][inventoryIndex.Item2];
			if (invItem == null) return false;
			var removedFromInventory = inventoryRemove(player, invItem.slot, inventoryIndex.Item1);
			if (!removedFromInventory) return false;
			Save.field(player, "inventory", player.data.inventory);
			Sync.inventory(player);
			return true;
		}
		public static (Item, int) findItemBySlot(MyPlayer player, string option, int tab = -1) {
			if (option.StartsWith("i")) {
				var item = getInventoryItem(player, Utils.stripCategory(option), tab);
				if (item == null) return (null, -1);
				return (item, player.data.inventory[tab].FindIndex(x => x.slot == item.slot));
			} else if (option.StartsWith("e")) {
				var item = getEquipmentItem(player, Utils.stripCategory(option));
				if (item == null) return (null, -1);
				return (item, player.data.equipment.FindIndex(x => x.slot == item.slot));
			} else if (option.StartsWith("t")) {
				var item = getToolbarItem(player, Utils.stripCategory(option));
				if (item == null) return (null, -1);
				return (item, player.data.toolbar.FindIndex(x => x.slot == item.slot));
			}
			return (null, -1);
		}
		public static string getSlotType(string slot) {
			if (slot.StartsWith("i")) return "inventory";
			if (slot.StartsWith("tab")) return "tab";
			if (slot.StartsWith("t")) return "toolbar";
			if (slot.StartsWith("g")) return "ground";
			if (slot.StartsWith("e")) return "equipment";
			return string.Empty;
		}
		public static void saveFields(MyPlayer player, List<string> fields) {
			var playerData = Utils.ToDictionary(player.data);
			fields.ForEach(key => Save.field(player, key, playerData[key]));
		}
		public static void handleSwapOrStack(MyPlayer player, string selectedSlot, string endSlot, int tab, List<Usefull.Action> itemRules) {
			var fieldsToSafe = new List<string>();
			var selectItem = findItemBySlot(player, selectedSlot, tab);
			var endItem = findItemBySlot(player, endSlot, tab);
			if (endItem.Item1 == null || selectItem.Item1 == null) {
				Logger.LogColored(
					new string[] { "No end slot for this item...", selectedSlot, " to ", endSlot, " at ", tab.ToString(), " (may be null)" }, 
					new ConsoleColor[] { ConsoleColor.Gray, ConsoleColor.Green, ConsoleColor.Gray, ConsoleColor.Green, ConsoleColor.Gray, ConsoleColor.DarkCyan, ConsoleColor.Gray });
				Sync.inventory(player);
				return;
			}
			var newSelectSlot = endItem.Item1.slot;
			var newEndSlot = selectItem.Item1.slot;
			var selectIndex = endItem.Item2;
			var endIndex = selectItem.Item2;
			var selectedSlotName = getSlotType(selectedSlot);
			var endSlotName = getSlotType(endSlot);
			fieldsToSafe.Add(selectedSlotName);
			fieldsToSafe.Add(endSlotName);
			if (fieldsToSafe.Contains(null)) {
				Sync.inventory(player);
				return;
			}
			var isSelectInventory = selectedSlotName.Contains("inventory");
			var isEndInventory = selectedSlotName.Contains("inventory");
			var isSelectEquipment = Utils.isFlagEnabled(selectItem.Item1.behavior, ItemType.IS_EQUIPMENT);
			var isEndEquipment = Utils.isFlagEnabled(endItem.Item1.behavior, ItemType.IS_EQUIPMENT);
			if (isSelectEquipment || isEndEquipment) {
				if (endItem.Item1.equipment != selectItem.Item1.equipment) {
					Sync.inventory(player);
					return;
				}
			}
			var playerData = Utils.ToDictionary(player.data);
			var selectedArray = isSelectInventory ? (playerData[selectedSlotName] as List<List<Item>>)[tab] : playerData[selectedSlotName] as List<Item>;
			List<Item> endArray;
			if (selectedSlotName == endSlotName) {
				endArray = selectedArray;
			} else {
				endArray = isEndInventory ? (playerData[endSlotName] as List<List<Item>>)[tab] : playerData[endSlotName] as List<Item>;
			}
			if (selectItem.Item1.name != endItem.Item1.name) {
				if (!allItemRulesValid(player, selectItem.Item1, new CategoryData() { name = endSlotName }, newEndSlot, itemRules, tab)) {
					Sync.inventory(player);
					return;
				}
				if (!allItemRulesValid(player, endItem.Item1, new CategoryData() { name = selectedSlotName }, newSelectSlot, itemRules, tab)) {
					Sync.inventory(player);
					return;
				}
				selectedArray[selectIndex] = endItem.Item1;
				selectedArray[selectIndex].slot = newEndSlot;
				endArray[endIndex] = selectItem.Item1;
				endArray[endIndex].slot = newSelectSlot;
			} else {
				var isSelectStackable = Utils.isFlagEnabled(selectItem.Item1.behavior, ItemType.CAN_STACK);
				var isEndStackable = Utils.isFlagEnabled(endItem.Item1.behavior, ItemType.CAN_STACK);
				if (!isSelectStackable || !isEndStackable) {
					Sync.inventory(player);
					return;
				}
				endArray[endIndex].quantity += selectItem.Item1.quantity;
				selectedArray.RemoveAt(selectIndex);
			}
			if (selectedSlotName != endSlotName) {
				if (isSelectInventory) {
					(playerData[selectedSlotName] as List<List<Item>>)[tab] = selectedArray;
				} else {
					playerData[selectedSlotName] = selectedArray;
				}
				if (isEndInventory) {
					(playerData[endSlotName] as List<List<Item>>)[tab] = endArray;
				} else {
					playerData[endSlotName] = endArray;
				}
			} else {
				if (isSelectInventory) {
					(playerData[selectedSlotName] as List<List<Item>>)[tab] = selectedArray;
				} else {
					playerData[selectedSlotName] = selectedArray;
				}
				fieldsToSafe.RemoveAt(fieldsToSafe.Count - 1);
				Emit.sound2D(player, "item_shuffle_1", Convert.ToSingle(new Random().NextDouble() * 0.45 + 0.1));
			}
			player.data = Utils.ToObject<Character>(playerData);
			saveFields(player, fieldsToSafe);
			Sync.inventory(player);
		}
		public static bool allItemRulesValid(MyPlayer player, Item item, CategoryData endSlot, int endSlotIndex, List<Usefull.Action> itemRules, int tab) {
			if (endSlot != null) {
				if (!Utils.isFlagEnabled(item.behavior, ItemType.CAN_DROP) && endSlot.name == Utils.GetDescription(InventoryType.GROUND)) {
					return false;
				}
				if (!Utils.isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name == Utils.GetDescription(InventoryType.EQUIPMENT)) {
					return false;
				}
				if (!Utils.isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR) && endSlot.name == Utils.GetDescription(InventoryType.TOOLBAR)) {
					return false;
				}
				if (Utils.isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name == Utils.GetDescription(InventoryType.EQUIPMENT)) {
					if (!isEquipmentSlotValid(item, (EquipmentType)Enum.Parse(typeof(EquipmentType), endSlotIndex.ToString()))) {
						return false;
					}
				}
			}
			if (itemRules.Count >= 1) {
				for (int i = 0; i < itemRules.Count; i++) {
					if (!itemRules[i].Equals((player, item, !string.IsNullOrEmpty(endSlot.name) ? endSlot.name : null, endSlotIndex, tab))) {
						return false;
					}
				}
			}
			return true;
		}
		public static List<ItemSpecial> getAllItems(MyPlayer player) {
			var items = new List<ItemSpecial>();
			for (int i = 0; i < player.data.equipment.Count; i++) {
				var item = Utils.deepCloneObject<ItemSpecial>(player.data.equipment[i]);
				item.dataIndex = i;
				item.dataName = "equipment";
				item.isEquipment = true;
				items.Add(item);
			}
			for (int i = 0; i < player.data.toolbar.Count; i++) {
				var item = Utils.deepCloneObject<ItemSpecial>(player.data.toolbar[i]);
				item.dataIndex = i;
				item.dataName = "toolbar";
				item.isToolbar = true;
				items.Add(item);
			}
			for (int index = 0; index < player.data.inventory.Count; index++) {
				var tab = player.data.inventory[index];
				for (int originalIndex = 0; originalIndex < tab.Count; originalIndex++) {
					var originalItem = tab[originalIndex];
					var item = Utils.deepCloneObject<ItemSpecial>(originalItem);
					item.dataIndex = originalIndex;
					item.dataName = "inventory";
					item.isInventory = true;
					item.dataTab = index;
					items.Add(item);
				}
			}
			return items;
		}
		public static bool stackInventoryItem(MyPlayer player, Item item) {
			var existing = isInInventory(player, item);
			if (existing.Item1 == -1) return false;
			player.data.inventory[existing.Item1][existing.Item2].quantity += item.quantity;
			Save.field(player, "inventory", player.data.inventory);
			Sync.inventory(player);
			return true;
		}
		public static List<ItemSpecial> getAllWeapons(MyPlayer player) {
			var weapons = getAllItems(player).FindAll(x => Utils.isFlagEnabled(x.behavior, ItemType.IS_WEAPON));
			if (weapons.Count == 0) return new List<ItemSpecial>();
			return weapons;
		}
		public static List<Item> removeAllWeapons(MyPlayer player) {
			var weapons = getAllWeapons(player);
			if (weapons.Count == 0) return new List<Item>();
			var removedWeapons = new List<Item>();
			for (int i = weapons.Count -1; i >= 0; i--) {
				Item weapon = ((player.data as IDictionary<string, object>)[weapons[i].dataName] as List<Item>)[weapons[i].dataIndex];
				if (weapons[i].isInventory) {
					weapon = ((player.data as IDictionary<string, object>)[weapons[i].dataName] as List<List<Item>>)[weapons[i].dataTab][weapons[i].dataIndex];
					removedWeapons.Add(weapon);
					((player.data as IDictionary<string, object>)[weapons[i].dataName] as List<List<Item>>)[weapons[i].dataTab].RemoveAt(weapons[i].dataIndex);
					continue;
				}
				((player.data as IDictionary<string, object>)[weapons[i].dataName] as List<Item>).RemoveAt(weapons[i].dataIndex);
				removedWeapons.Add(weapon);
			}
			Save.field(player, "inventory", player.data.inventory);
			Save.field(player, "toolbar", player.data.toolbar);
			Sync.inventory(player);
			player.RemoveAllWeapons();
			return removedWeapons;
		}
	}

	public class Create {
		public static void character(MyPlayer player, Design design, CharInfo info, string name) {
			using var db = new TlrpEntities();
			var newCharacter = new Character() {
				name = name,
				accId = player.accountData.id,
				position = DefaultConfig.PLAYER_NEW_SPAWN_POS,
				cash = DefaultConfig.PLAYER_CASH,
				bank = DefaultConfig.PLAYER_BANK,
				design = design,
				info = info,
				hunger = 100.0,
				thirst = 100.0,
				mood = 100.0,
				blood = 7500.0,
				isUnconscious = false,
				armour = 0,
				hours = 0,
				vehicles = new List<Database.Vehicle>()
			};
			var character = db.Characters.Update(newCharacter);
			db.SaveChanges();
			Select.character(player, character.Entity);
		}
	}

	public class Safe {
		public static void setPosition(MyPlayer player, float x, float y, float z) {
			if (!player.hasModel.HasValue || !player.hasModel.Value) {
				player.hasModel = true;
				player.Model = (uint)PedModel.FreemodeMale01;
				player.Spawn(new Position(x, y, z), 0);
			}
			player.acPosition = new Position(x, y, z);
			player.Position = new Position(x, y, z);
		}
		public static void AddArmour(MyPlayer player, int value, bool exact = false) {
			if (exact) {
				player.acArmour = value;
				player.Armor = (ushort)value;
				return;
			}
			player.acArmour = Math.Min(100, player.acArmour + value);
			player.Armor = (ushort)player.acArmour;
		}
		public static void AddBlood(MyPlayer player, double value, bool exact = false) {
			adjustAttribute(player, value, "blood");
		}
		public static void AddFood(MyPlayer player, double value, bool exact = false) {
			adjustAttribute(player, value, "hunger");
		}
		public static void AddWater(MyPlayer player, double value, bool exact = false) {
			adjustAttribute(player, value, "thirst");
		}
		public static void AddMood(MyPlayer player, int value, bool exact = false) {
			adjustAttribute(player, value, "mood");
		} 
		private static void adjustAttribute(MyPlayer player, int value, string field) {
			var playerData = Utils.ToDictionary(player.data);
			if (playerData[field] == null) playerData.Add(field, value);
			playerData[field] = Math.Min(100, Math.Max(0, (int)playerData[field] + value));
			Emit.meta(player, field, playerData[field]);
			Save.field(player, field, playerData[field]);
		}
		private static void adjustAttribute(MyPlayer player, double value, string field) {
			var playerData = Utils.ToDictionary(player.data);
			if (playerData[field] == null) playerData.Add(field, value);
			var minValue = field switch { "blood" => 2500.0, _ => 0.0 };
			var maxValue = field switch { "blood" => 7500.0, _ => 100.0 };
			playerData[field] = Math.Min(maxValue, Math.Max(minValue, (double)playerData[field] + value));
			Emit.meta(player, field, playerData[field]);
			Save.field(player, field, playerData[field]);
		}
		private static void adjustAttribute(MyPlayer player, ushort value, string field) {
			var playerData = Utils.ToDictionary(player.data);
			if (playerData[field] == null) playerData.Add(field, value);
			var minValue = field switch { "blood" => 2500.0, _ => 0.0 };
			var maxValue = field switch { "blood" => 7500.0, _ => 100.0 };
			playerData[field] = Math.Min(maxValue, Math.Max(minValue, (ushort)playerData[field] + value));
			Emit.meta(player, field, playerData[field]);
			Save.field(player, field, playerData[field]);
		}
	}

	public class Save {
		public static void field(MyPlayer player, string fieldName, object fieldValue) {
			using var db = new TlrpEntities();
			var playerData = Utils.ToDictionary(player.data);
			playerData[fieldName] = fieldValue;
			player.data = Utils.ToObject<Character>(playerData);
			db.Characters.Update(player.data);
			db.SaveChanges();
		}
		public static void partial(MyPlayer player) {
			using var db = new TlrpEntities();
			db.Characters.Update(player.data);
			db.SaveChanges();
		}
		public static void onTick(MyPlayer player) {
			player.Health = 199;
			player.data.position = player.Position;
			player.data.armour = player.Armor;
			field(player, "position", player.data.position);
			field(player, "armour", player.data.armour);
			field(player, "blood", player.data.blood);
			field(player, "hunger", player.data.hunger);
			field(player, "thirst", player.data.thirst);
			field(player, "mood", player.data.mood);
		}
	}
	public class Select {
		public static void character(MyPlayer player, Character charData) {
			player.data = charData;
			Sync.design(player);
			player.Emit(Utils.GetDescription(SystemEvent.TICKS_START));
			player.Dimension = 0;
			Setter.frozen(player, true);
			System.Threading.Tasks.Task.Delay(500).ContinueWith(task => { 
				if (player.data.position != new Position(0, 0, 0)) Safe.setPosition(player, player.data.position.X, player.data.position.Y, player.data.position.Z);
				else Safe.setPosition(player, DefaultConfig.PLAYER_NEW_SPAWN_POS.X, DefaultConfig.PLAYER_NEW_SPAWN_POS.Y, DefaultConfig.PLAYER_NEW_SPAWN_POS.Z);
				if (player.data.exterior != new Position(0, 0, 0)) {
					Safe.setPosition(player, player.data.exterior.X, player.data.exterior.Y, player.data.exterior.Z);
					player.data.exterior = new Position(0, 0, 0);
					Save.field(player, "exterior", player.data.exterior);
				}
				Safe.AddArmour(player, player.data.armour, true);
				if (player.data.isUnconscious) {
					player.nextUnconsciousSpawn = DateTime.Now.AddMinutes(3).Ticks;
					player.data.isUnconscious = true;
					Safe.AddBlood(player, 2500.0, true);
					Emit.meta(player, "isUnconscious", true);
				} else {
					player.data.isUnconscious = true;
					Emit.meta(player, "isUnconscious", false);
				}
				Sync.economyData(player);
				Sync.weather(player);
				Sync.time(player);
				Sync.inventory(player);
				Sync.hunger(player);
				Sync.thirst(player);
				Sync.mood(player);
				Sync.vehicles(player);
				//InteractionManager.populateCustomInteractions(player);
				//BlipManager.populateGlobalBlips(player);
				//MarkerManager.populateGlobalMarkers(player);
				//TextLabelManager.populateGlobalLabels(player);
				Alt.Emit(Utils.GetDescription(SystemEvent.VOICE_ADD), player);
				Alt.Emit(Utils.GetDescription(TlrpEvent.SELECTED_CHARACTER), player);
			});
			player.characters = null;
		} 
	}
	public class Setter {
		public static void account(MyPlayer player, Account accountData) {
			if (string.IsNullOrEmpty(accountData.quickToken) || DateTime.Now.Ticks > accountData.quickTokenExpiration || player.needsQT.Value) {
				using var db = new TlrpEntities();
				var qt = Encryption.getUniquePlayerHash(player, player.discord.Id.ToString());
				accountData.quickToken = qt;
				accountData.quickTokenExpiration = DateTime.Now.AddDays(2).Ticks;
				db.Accounts.Update(accountData);
				db.SaveChanges();
				player.Emit(Utils.GetDescription(SystemEvent.QUICK_TOKEN_UPDATE), player.discord.Id);
			}
			Emit.meta(player, "permissionLevel", accountData.permissionLevel);
			player.accountData = accountData;
		}
		public static void actionMenu(MyPlayer player, Dictionary<string, Usefull.Action> actionMenu) {
			player.Emit(Utils.GetDescription(SystemEvent.SET_ACTION_MENU), actionMenu);
		}
		public static void actionMenu(MyPlayer player, Dictionary<string, Dictionary<string, Usefull.Action>> actionMenu) {
			player.Emit(Utils.GetDescription(SystemEvent.SET_ACTION_MENU), actionMenu);
		}
		public static void unconscious(MyPlayer player, MyPlayer killer = null, uint weaponHas = 0) {
			player.Spawn(new Position(player.Position.X, player.Position.Y, player.Position.Z), 0);
			if (!player.data.isUnconscious) {
				player.data.isUnconscious = true;
				Emit.meta(player, "isUnconscious", true);
				Logger.LogColored(
					new string[] { "(", player.Id.ToString(), ") ist bewusstlos geworden" }, 
					new ConsoleColor[] { ConsoleColor.Gray, ConsoleColor.Green, ConsoleColor.Gray }
				);
			}
			if (player.nextUnconsciousSpawn <= DateTime.Now.Ticks) 
				player.nextUnconsciousSpawn = DateTime.Now.AddMilliseconds(DefaultConfig.RESPAWN_TIME).Ticks;
			player.Emit(Utils.GetDescription(TlrpEvent.UNCONSCIOUS), player);
		}
		public static void firstConnect(MyPlayer player) {
			if (player == null || !player.Exists) return;
			if (Environment.GetEnvironmentVariable("TLRP_READY") == "false") {
				player.Kick("Der Server ist noch im Ladeprozess...");
				return;
			}
			var pos = DefaultConfig.CHARACTER_SELECT_POS;
			player.Dimension = player.Id + 1;
			player.pendingLogin = true;
			Updater.init(player, null);
			Safe.setPosition(player, pos.X, pos.Y, pos.Z);
			Sync.time(player);
			Sync.weather(player);
			System.Threading.Tasks.Task.Delay(500).ContinueWith(task => {
				if (player == null || !player.Exists) return;
				player.Emit(Utils.GetDescription(SystemEvent.QUICK_TOKEN_FETCH));
			});
		}
		public static void frozen(MyPlayer player, bool value) {
			player.Emit(Utils.GetDescription(SystemEvent.PLAYER_SET_FREEZE), value);
		}
		public static void respawned(MyPlayer player, Position position) {
			player.nextUnconsciousSpawn = DateTime.Now.AddMinutes(-5).Ticks;
			player.data.isUnconscious = false;
			Emit.meta(player, "isUnconscious", false);
			Save.field(player, "isUnconscious", false);
			var nearestHospital = position;
			if (position == Position.Zero) {
				var hospitals = DefaultConfig.VALID_HOSPITALS;
				var index = 0;
				var lastDistance = player.Position.Distance(hospitals[0]);
				for (int i = 1; i < hospitals.Count; i++) {
					var distanceCalc = player.Position.Distance(hospitals[i]);
					if (distanceCalc > lastDistance) continue;
					lastDistance = distanceCalc;
					index = i;
				}
				nearestHospital = hospitals[index];
				if (DefaultConfig.RESPAWN_LOSE_WEAPONS) Inventory.removeAllWeapons(player);
			}
			Safe.setPosition(player, nearestHospital.X, nearestHospital.Y, nearestHospital.Z);
			player.Spawn(nearestHospital, 0);
			player.ClearBloodDamage();
			Safe.AddBlood(player, DefaultConfig.RESPAWN_HEALTH, true);
			Safe.AddArmour(player, DefaultConfig.RESPAWN_ARMOUR, true);
			player.Emit(Utils.GetDescription(TlrpEvent.PLAYER_SPAWNED), player);
		}
	}
	public class Sync {
		public static void economyData(MyPlayer player) {
			var playerData = Utils.ToDictionary(player.data);
			Enum.GetNames(typeof(EconomyType)).ToList().ForEach(name => Emit.meta(player, name.ToLower(),  playerData[name.ToLower()]));
		}
		public static void design(MyPlayer player) {
			var pos = player.Position;
			var dim = player.Dimension;
			player.Despawn();
			player.Model = player.data.design.sex switch { 0 => (uint)PedModel.FreemodeFemale01, _ => (uint)PedModel.FreemodeMale01 };
			player.Spawn(pos, 10);
			player.Dimension = dim;
			player.SetSyncedMetaData("name", player.data.name);
			Emit.meta(player, "design", player.data.design);
			player.Emit(Utils.GetDescription(ViewEvent.Creator_Sync), player.data.design);
		}
		public static void inventory(MyPlayer player) {
			if (player.data.inventory.Count == 0) player.data.inventory = new List<List<Item>>() { 
					new List<Item>(),
					new List<Item>(),
					new List<Item>(),
					new List<Item>(),
					new List<Item>(),
					new List<Item>(),
				};
			if (player.data.toolbar.Count == 0) player.data.toolbar = new List<Item>();
			if (player.data.equipment.Count == 0) player.data.equipment = new List<Item>();
			Emit.meta(player, "inventory", player.data.inventory);
			Emit.meta(player, "equipment", player.data.equipment);
			Emit.meta(player, "toolbar", player.data.toolbar);
		}
		public static void syncedMeta(MyPlayer player) {
			player.SetSyncedMetaData("ping", player.Ping);
			player.SetSyncedMetaData("position", player.Position);
		}
		public static void time(MyPlayer player) {
			player.Emit(Utils.GetDescription(SystemEvent.WORLD_UPDATE_TIME), World.hour, World.minute);
		}
		public static void weather(MyPlayer player) {
			player.gridSpace = World.getGridSpace(player);
			player.weather = World.getWeatherByGrid(player.gridSpace);
			player.Emit(Utils.GetDescription(SystemEvent.WORLD_UPDATE_WEATHER), player.weather);
		}
		public static void playTime(MyPlayer player) {
			player.data.hours += 0.166666666666667;
			Save.field(player, "hours", player.data.hours);
		}
		public static void hunger(MyPlayer player) {
			if (player.data.isUnconscious && player.data.hunger <= 0) {
				player.data.hunger = 100.0;
				Emit.meta(player, "hunger", player.data.hunger);
				return;
			}
			Safe.AddFood(player, -DefaultConfig.FOOD_REMOVAL_RATE);
		}
		public static void thirst(MyPlayer player) {
			if (player.data.isUnconscious && player.data.thirst <= 0) {
				player.data.thirst = 100.0;
				Emit.meta(player, "thirst", player.data.thirst);
				return;
			}
			Safe.AddFood(player, -DefaultConfig.WATER_REMOVAL_RATE);
		}
		public static void mood(MyPlayer player) {
			if (player.data.isUnconscious && player.data.mood <= 0) {
				player.data.mood = 100.0;
				Emit.meta(player, "mood", player.data.mood);
				return;
			}
			Safe.AddFood(player, -DefaultConfig.MOOD_REMOVAL_RATE);
		}
		public static void vehicles(MyPlayer player) {
			Emit.meta(player, "vehicles", player.data.vehicles);
		}
	}
}
