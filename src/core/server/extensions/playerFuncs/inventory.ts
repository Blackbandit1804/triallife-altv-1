import * as alt from 'alt-server';
import { EquipmentType, InventoryType, ItemType } from '../../../shared/utility/enums';
import { Item, ItemSpecial } from '../../../shared/interfaces/item';
import { deepCloneObject, isFlagEnabled } from '../../../shared/utility/usefull';
import { CategoryData } from '../../interfaces/category-data';
import { stripCategory } from '../../utility/usefull';
import emit from './emit';
import save from './save';
import sync from './synchronize';
import Logger from '../../utility/Logger';

function getFreeInventorySlot(p: alt.Player): { slot: number } | null {
    for (let x = 0; x < parseInt(p.data.inventory.maxWeight.toFixed(0)); x++) {
        const itemIndex = p.data.inventory.items.findIndex((item) => item.slot === x);
        if (itemIndex !== -1) continue;
        return { slot: x };
    }
    return null;
}

function hasItem(player: alt.Player, item: Partial<Item>): boolean {
    let hasInInventory = isInInventory(player, item);
    if (hasInInventory) return true;
    let hasInToolbar = isInToolbar(player, item);
    if (hasInToolbar) return true;
    return false;
}

function hasWeapon(player: alt.Player): Item | null {
    for (let i = 0; i < parseInt(player.data.inventory.maxWeight.toFixed(0)); i++) {
        const inventoryItem = player.data.inventory.items[i];
        if (!inventoryItem) continue;
        if (!inventoryItem.data) continue;
        if (!inventoryItem.data.hash) continue;
        if (!isFlagEnabled(inventoryItem.behavior, ItemType.IS_WEAPON)) continue;
        return inventoryItem as Item;
    }
    for (let i = 0; i < player.data.toolbar.length; i++) {
        const item = player.data.toolbar[i];
        if (!item) continue;
        if (!item.data) continue;
        if (!item.data.hash) continue;
        if (!isFlagEnabled(item.behavior, ItemType.IS_WEAPON)) continue;
        return item as Item;
    }
    return null;
}

function getInventoryItem(p: alt.Player, slot: number): Item | null {
    if (slot >= parseInt(p.data.inventory.maxWeight.toFixed(0))) return null;
    const index = p.data.inventory.items.findIndex((item) => item.slot === slot);
    if (index === -1) return null;
    return deepCloneObject<Item>(p.data.inventory.items[index]);
}

function replaceInventoryItem(p: alt.Player, item: Item): boolean {
    const itemIndex = p.data.inventory.items.findIndex((existingItem) => existingItem.uuid === item.uuid);
    if (itemIndex === -1) return false;
    p.data.inventory.items[itemIndex] = item;
    return true;
}

function getEquipmentItem(p: alt.Player, slot: number): Item | null {
    if (slot >= 11) return null;
    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index === -1) return null;
    return deepCloneObject<Item>(p.data.equipment[index]);
}

function getToolbarItem(p: alt.Player, slot: number): Item | null {
    if (slot >= 5) return null;
    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index === -1) return null;
    return deepCloneObject<Item>(p.data.toolbar[index]);
}

function isInInventory(p: alt.Player, item: Partial<Item>): { index: number } | null {
    if (p.data.inventory.items.length === 0) return null;
    if (!item) throw new Error(`[3L:RP] Specified item is null for isInInventory`);
    for (let i = 0; i < p.data.inventory.items.length; i++) {
        const inventoryItem = p.data.inventory.items[i];
        if (!item) continue;
        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === inventoryItem[key]);
        if (keyIndex === -1) continue;
        return { index: i };
    }
    return null;
}

function isInEquipment(p: alt.Player, item: Partial<Item>): { index: number } | null {
    if (p.data.equipment.length === 0) return null;
    if (!item) throw new Error(`[3L:RP] Specified item is null for isInEquipment`);
    for (let i = 0; i < p.data.equipment.length; i++) {
        const equipmentItem = p.data.equipment[i];
        if (!equipmentItem) continue;
        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === equipmentItem[key]);
        if (keyIndex === -1) continue;
        return { index: i };
    }
    return null;
}

function isEquipmentSlotFree(p: alt.Player, slot: EquipmentType): boolean {
    if (slot >= 11) return false;
    if (p.data.equipment.length === 0) return true;
    return p.data.equipment.findIndex((item) => item.slot === slot) === -1;
}

function isInventorySlotFree(p: alt.Player, slot: number): boolean {
    if (slot >= parseInt(p.data.inventory.maxWeight.toFixed(0))) return false;
    const index = p.data.inventory.items.findIndex((item) => item.slot === slot);
    if (index === -1) return true;
    return false;
}

function inventoryAdd(p: alt.Player, item: Item, slot: number): boolean {
    if (slot >= parseInt(p.data.inventory.maxWeight.toFixed(0))) return false;
    if (!p.data.inventory.items) return false;
    const index = p.data.inventory.items.findIndex((item) => item.slot === item.slot);
    if (index !== -1) return false;
    if (item.slot !== slot) item.slot = slot;
    const safeItemCopy = deepCloneObject(item);
    p.data.inventory.items.push(safeItemCopy);
    return true;
}

function inventoryRemove(p: alt.Player, slot: number): boolean {
    if (slot >= parseInt(p.data.inventory.maxWeight.toFixed(0))) return false;
    if (!p.data.inventory.items) return false;
    const index = p.data.inventory.items.findIndex((item) => item.slot === slot);
    if (index === -1) return false;
    p.data.inventory.items.splice(index, 1);
    return true;
}

function equipmentRemove(p: alt.Player, slot: EquipmentType): boolean {
    if (slot >= 11) return false;
    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index === -1) return false;
    p.data.equipment.splice(index, 1);
    return true;
}

function isEquipmentSlotValid(item: Item, slot: EquipmentType) {
    if (slot >= 11) return false;
    if (item.equipment === null || item.equipment === undefined) return false;
    if (item.equipment !== slot) return false;
    return true;
}

function equipmentAdd(p: alt.Player, item: Item, slot: EquipmentType): boolean {
    if (!isEquipmentSlotFree(p, slot)) return false;
    if (item.equipment !== slot) return false;
    if (item.slot !== slot) item.slot = slot;
    const safeItemCopy = deepCloneObject(item);
    p.data.equipment.push(safeItemCopy);
    return true;
}

function isToolbarSlotFree(p: alt.Player, slot: number): boolean {
    if (slot >= 5) return false;
    if (p.data.toolbar.length >= 5) return false;
    return p.data.toolbar.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

function toolbarAdd(p: alt.Player, item: Item, slot: number): boolean {
    if (slot >= 5) return false;
    if (!isToolbarSlotFree(p, slot)) return false;
    if (item.slot !== slot) item.slot = slot;
    const safeItemCopy = deepCloneObject(item);
    p.data.toolbar.push(safeItemCopy);
    return true;
}

function toolbarRemove(p: alt.Player, slot: number): boolean {
    if (slot >= 5) return false;
    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index === -1) return false;
    p.data.toolbar.splice(index, 1);
    return true;
}

function replaceToolbarItem(p: alt.Player, item: Item): boolean {
    const itemIndex = p.data.toolbar.findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex === -1) return false;
    p.data.toolbar[itemIndex] = item;
    return true;
}

function isInToolbar(p: alt.Player, item: Partial<Item>): { index: number } | null {
    if (p.data.toolbar.length == 0) return null;
    if (!item) throw new Error(`[3L:RP] Specified item is null for isInToolbar`);
    for (let i = 0; i < p.data.toolbar.length; i++) {
        const toolbarItem = p.data.toolbar[i];
        if (!toolbarItem) continue;
        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === toolbarItem[key]);
        if (keyIndex === -1) continue;
        return { index: i };
    }
    return null;
}

function findAndRemove(player: alt.Player, itemName: string): boolean {
    const toolbarItem = isInToolbar(player, { name: itemName });
    if (toolbarItem) {
        const item = player.data.toolbar[toolbarItem.index];
        if (!item) return false;
        const removedFromToolbar = toolbarRemove(player, item.slot);
        if (!removedFromToolbar) return false;
        save.field(player, 'toolbar', player.data.toolbar);
        sync.inventory(player);
        return true;
    }
    const inventoryItem = isInInventory(player, { name: itemName });
    if (!inventoryItem) return false;
    const item = player.data.inventory.items[inventoryItem.index];
    if (!item) return false;
    const removedFromInventory = inventoryRemove(player, item.slot);
    if (!removedFromInventory) return false;
    save.field(player, 'inventory', player.data.inventory);
    sync.inventory(player);
    return true;
}

function findItemBySlot(player: alt.Player, selectedSlot: string): { item: Item; index: number } | null {
    if (selectedSlot.includes('i')) {
        const item = getInventoryItem(player, stripCategory(selectedSlot));
        if (!item) return null;
        return { item: deepCloneObject(item), index: player.data.inventory.items.findIndex((i) => i.slot === item.slot) };
    }
    if (selectedSlot.includes('e')) {
        const item = getEquipmentItem(player, stripCategory(selectedSlot));
        if (!item) return null;
        return { item: deepCloneObject(item), index: player.data.equipment.findIndex((i) => i.slot === item.slot) };
    }
    if (selectedSlot.includes('t')) {
        const item = getToolbarItem(player, stripCategory(selectedSlot));
        if (!item) return null;
        return { item: deepCloneObject(item), index: player.data.toolbar.findIndex((i) => i.slot === item.slot) };
    }
    return null;
}

function getSlotType(slot: string): string {
    if (slot.includes('i')) return 'inventory';
    if (slot.includes('tab')) return 'tab';
    if (slot.includes('t')) return 'toolbar';
    if (slot.includes('g')) return 'ground';
    if (slot.includes('e')) return 'equipment';
    return null;
}

function saveFields(player: alt.Player, fields: string[]): void {
    for (let i = 0; i < fields.length; i++) save.field(player, fields[i], player.data[fields[i]]);
    sync.inventory(player);
}

function swapOrStack(player: alt.Player, selectedSlot: string, endSlot: string, customItemRules: Array<Function>) {
    const fieldsToSave = [];
    const selectItem = findItemBySlot(player, selectedSlot);
    const endItem = findItemBySlot(player, endSlot);
    if (!endItem || !selectItem) {
        Logger.log(`No end slot for this item... ${selectedSlot} to ${endSlot} (may be null)`);
        sync.inventory(player);
        return;
    }
    const newSelectSlot = endItem.item.slot;
    const newEndSlot = selectItem.item.slot;
    const selectIndex = selectItem.index;
    const endIndex = endItem.index;
    const selectedSlotName = getSlotType(selectedSlot);
    const endSlotName = getSlotType(endSlot);
    fieldsToSave.push(selectedSlotName);
    fieldsToSave.push(endSlotName);
    if (fieldsToSave.includes(null)) {
        sync.inventory(player);
        return;
    }
    const isSelectInventory = selectedSlotName.includes('inventory');
    const isEndInventory = endSlotName.includes('inventory');
    const isSelectEquipment = isFlagEnabled(selectItem.item.behavior, ItemType.IS_EQUIPMENT);
    const isEndEquipment = isFlagEnabled(endItem.item.behavior, ItemType.IS_EQUIPMENT);
    if (isSelectEquipment || isEndEquipment) {
        if (endItem.item.equipment !== selectItem.item.equipment) {
            sync.inventory(player);
            return;
        }
    }
    const selectedArray: Array<Item> = isSelectInventory ? player.data[selectedSlotName].items : player.data[selectedSlotName];
    let endArray;
    if (selectedSlotName === endSlotName) endArray = selectedArray;
    else endArray = isEndInventory ? player.data[endSlotName].items : player.data[endSlotName];
    if (selectItem.item.name !== endItem.item.name) {
        if (!allItemRulesValid(player, selectItem.item, { name: endSlotName }, newEndSlot, customItemRules)) {
            sync.inventory(player);
            return;
        }
        if (!allItemRulesValid(player, endItem.item, { name: selectedSlotName }, newSelectSlot, customItemRules)) {
            sync.inventory(player);
            return;
        }
        selectedArray[selectIndex] = endItem.item;
        selectedArray[selectIndex].slot = newEndSlot;
        endArray[endIndex] = selectItem.item;
        endArray[endIndex].slot = newSelectSlot;
    } else {
        const isSelectStackable = isFlagEnabled(selectItem.item.behavior, ItemType.CAN_STACK);
        const isEndStackable = isFlagEnabled(endItem.item.behavior, ItemType.CAN_STACK);
        if (!isSelectStackable || !isEndStackable) {
            sync.inventory(player);
            return;
        }
        endArray[endIndex].quantity += selectItem.item.quantity;
        selectedArray.splice(selectIndex, 1);
    }
    if (selectedSlotName !== endSlotName) {
        if (isSelectInventory) player.data[selectedSlotName].items = selectedArray;
        else player.data[selectedSlotName] = selectedArray;
        if (isEndInventory) player.data[endSlotName].items = endArray;
        else player.data[endSlotName] = endArray;
    } else {
        if (isSelectInventory) player.data[selectedSlotName].items = selectedArray;
        else player.data[selectedSlotName] = selectedArray;
        fieldsToSave.pop();
        emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }
    saveFields(player, fieldsToSave);
    sync.inventory(player);
}

function allItemRulesValid(player: alt.Player, item: Item, endSlot: CategoryData, endSlotIndex: number | null, customItemRules: Array<Function>): boolean {
    if (!item.behavior) return true;
    if (endSlot) {
        if (!isFlagEnabled(item.behavior, ItemType.CAN_STACK) && endSlot.name === InventoryType.INVENTORY) return false;
        if (!isFlagEnabled(item.behavior, ItemType.CAN_DROP) && endSlot.name === InventoryType.GROUND) return false;
        if (!isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT) return false;
        if (!isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR) && endSlot.name === InventoryType.TOOLBAR) return false;
        if (isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT) {
            if (!isEquipmentSlotValid(item, endSlotIndex)) return false;
        }
    }
    if (customItemRules.length >= 1) {
        for (let i = 0; i < customItemRules.length; i++) {
            if (!customItemRules[i](player, item, endSlot ? endSlot.name : null, endSlotIndex)) return false;
        }
    }
    return true;
}

function getAllItems(player: alt.Player): Array<ItemSpecial> {
    let items = [];
    for (let i = 0; i < player.data.equipment.length; i++) {
        const item = deepCloneObject(player.data.equipment[i]) as ItemSpecial;
        item.dataIndex = i;
        item.dataName = 'equipment';
        item.isEquipment = true;
        items.push(item);
    }
    for (let i = 0; i < player.data.toolbar.length; i++) {
        const item = deepCloneObject(player.data.toolbar[i]) as ItemSpecial;
        item.dataIndex = i;
        item.dataName = 'toolbar';
        item.isToolbar = true;
        items.push(item);
    }
    for (let i = 0; i < player.data.inventory.items.length; i++) {
        const item = deepCloneObject(player.data.inventory.items[i]) as ItemSpecial;
        item.dataIndex = i;
        item.dataName = 'inventory';
        item.isInventory = true;
        items.push(item);
    }
    return items;
}

function stackInventoryItem(player: alt.Player, item: Item): boolean {
    const existingItem = isInInventory(player, item);
    if (!existingItem) return false;
    if (!isFlagEnabled(player.data.inventory.items[existingItem.index].behavior, ItemType.CAN_STACK)) return false;
    player.data.inventory.items[existingItem.index].quantity += item.quantity;
    save.field(player, 'inventory', player.data.inventory);
    sync.inventory(player);
    return true;
}

function getAllWeapons(player: alt.Player): Array<Item> {
    const weapons = getAllItems(player).filter((item) => isFlagEnabled(item.behavior, ItemType.IS_WEAPON));
    if (weapons.length === 0) return [];
    return weapons;
}

function removeAllWeapons(player: alt.Player): Array<Item> {
    const weapons = getAllItems(player).filter((item) => isFlagEnabled(item.behavior, ItemType.IS_WEAPON));
    if (weapons.length === 0) return [];
    const removedWeapons = [];
    for (let i = weapons.length - 1; i >= 0; i--) {
        if (weapons[i].isInventory) {
            removedWeapons.push(player.data[weapons[i].dataName].items.splice(weapons[i].dataIndex, 1));
            continue;
        }
        removedWeapons.push(player.data[weapons[i].dataName].splice(weapons[i].dataIndex, 1));
    }
    save.field(player, 'inventory', player.data.inventory);
    save.field(player, 'toolbar', player.data.toolbar);
    sync.inventory(player);
    player.removeAllWeapons();
    return removedWeapons;
}

import('../../views/inventory').catch((err) => {
    throw err;
});

export default {
    getFreeInventorySlot,
    allItemRulesValid,
    equipmentAdd,
    equipmentRemove,
    findAndRemove,
    getAllItems,
    getAllWeapons,
    getEquipmentItem,
    getInventoryItem,
    getSlotType,
    getToolbarItem,
    swapOrStack,
    hasItem,
    hasWeapon,
    inventoryAdd,
    inventoryRemove,
    isEquipmentSlotValid,
    isEquipmentSlotFree,
    isInEquipment,
    isInInventory,
    isInToolbar,
    isInventorySlotFree,
    isToolbarSlotFree,
    removeAllWeapons,
    replaceInventoryItem,
    replaceToolbarItem,
    stackInventoryItem,
    toolbarAdd,
    toolbarRemove
};
