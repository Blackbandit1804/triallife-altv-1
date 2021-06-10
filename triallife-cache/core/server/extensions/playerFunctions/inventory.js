import { InventoryType, ItemType } from '../../../shared/utility/enums';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { stripCategory } from '../../utility/category';
import emit from './emit';
import save from './save';
import sync from './sync';
function getFreeInventorySlot(p, tabNumber = null) {
    for (let i = 0; i < p.data.inventory.length; i++) {
        if (tabNumber !== null && i !== tabNumber) {
            continue;
        }
        const tab = p.data.inventory[i];
        if (tab.length >= 28) {
            continue;
        }
        for (let x = 0; x < 27; x++) {
            const itemIndex = tab.findIndex((item) => item.slot === x);
            if (itemIndex >= 0) {
                continue;
            }
            return { tab: i, slot: x };
        }
    }
    return null;
}
function hasItem(player, item) {
    let hasInInventory = isInInventory(player, item);
    if (hasInInventory) {
        return true;
    }
    let hasInToolbar = isInToolbar(player, item);
    if (hasInToolbar) {
        return true;
    }
    return false;
}
function hasWeapon(player) {
    for (let t = 0; t < player.data.inventory.length; t++) {
        const tab = player.data.inventory[t];
        if (tab.length <= 0) {
            continue;
        }
        for (let i = 0; i < tab.length; i++) {
            const inventoryItem = tab[i];
            if (!inventoryItem) {
                continue;
            }
            if (!inventoryItem.data) {
                continue;
            }
            if (!inventoryItem.data.hash) {
                continue;
            }
            if (!isFlagEnabled(inventoryItem.behavior, ItemType.IS_WEAPON)) {
                continue;
            }
            return inventoryItem;
        }
    }
    for (let i = 0; i < player.data.toolbar.length; i++) {
        const item = player.data.toolbar[i];
        if (!item) {
            continue;
        }
        if (!item.data) {
            continue;
        }
        if (!item.data.hash) {
            continue;
        }
        if (!isFlagEnabled(item.behavior, ItemType.IS_WEAPON)) {
            continue;
        }
        return item;
    }
    return null;
}
function getInventoryItem(p, slot, tab) {
    if (tab >= 6) {
        return null;
    }
    if (slot >= 28) {
        return null;
    }
    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }
    return deepCloneObject(p.data.inventory[tab][index]);
}
function replaceInventoryItem(p, item, tab) {
    const itemIndex = p.data.inventory[tab].findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex <= -1) {
        return false;
    }
    p.data.inventory[tab][itemIndex] = item;
    return true;
}
function getEquipmentItem(p, slot) {
    if (slot >= 11) {
        return null;
    }
    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }
    return deepCloneObject(p.data.equipment[index]);
}
function getToolbarItem(p, slot) {
    if (slot >= 4) {
        return null;
    }
    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }
    return deepCloneObject(p.data.toolbar[index]);
}
function isInInventory(p, item) {
    for (let t = 0; t < p.data.inventory.length; t++) {
        const tab = p.data.inventory[t];
        if (tab.length <= 0) {
            continue;
        }
        for (let i = 0; i < tab.length; i++) {
            const inventoryItem = tab[i];
            if (!item) {
                continue;
            }
            const objectKeys = Object.keys(item);
            const keyIndex = objectKeys.findIndex((key) => item[key] === inventoryItem[key]);
            if (keyIndex <= -1) {
                continue;
            }
            return { tab: t, index: i };
        }
    }
    return null;
}
function isInEquipment(p, item) {
    if (p.data.equipment.length <= 0) {
        return null;
    }
    if (!item) {
        throw new Error(`[3L:RP] Specified item is null for isInEquipment`);
    }
    for (let i = 0; i < p.data.equipment.length; i++) {
        const equipmentItem = p.data.equipment[i];
        if (!equipmentItem) {
            continue;
        }
        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === equipmentItem[key]);
        if (keyIndex <= -1) {
            continue;
        }
        return { index: i };
    }
    return null;
}
function isEquipmentSlotFree(p, slot) {
    if (slot >= 11) {
        return false;
    }
    if (p.data.equipment.length <= 0) {
        return true;
    }
    return p.data.equipment.findIndex((item) => item.slot === slot) === -1 ? true : false;
}
function isInventorySlotFree(p, slot, tab) {
    if (tab >= 6) {
        return false;
    }
    if (slot >= 28) {
        return false;
    }
    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return true;
    }
    return false;
}
function inventoryAdd(p, item, slot, tab) {
    if (tab >= 6) {
        return false;
    }
    if (slot >= 28) {
        return false;
    }
    if (!p.data.inventory[tab]) {
        return false;
    }
    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);
    if (index >= 0) {
        return false;
    }
    if (item.slot !== slot) {
        item.slot = slot;
    }
    const safeItemCopy = deepCloneObject(item);
    p.data.inventory[tab].push(safeItemCopy);
    return true;
}
function inventoryRemove(p, slot, tab) {
    if (slot >= 28) {
        return false;
    }
    if (tab >= 6) {
        return false;
    }
    if (!p.data.inventory[tab]) {
        return false;
    }
    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }
    p.data.inventory[tab].splice(index, 1);
    return true;
}
function equipmentRemove(p, slot) {
    if (slot >= 11) {
        return false;
    }
    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }
    p.data.equipment.splice(index, 1);
    return true;
}
function isEquipmentSlotValid(item, slot) {
    if (slot >= 11) {
        return false;
    }
    if (item.equipment === null || item.equipment === undefined) {
        return false;
    }
    if (item.equipment !== slot) {
        return false;
    }
    return true;
}
function equipmentAdd(p, item, slot) {
    if (slot >= 11) {
        return false;
    }
    if (!isEquipmentSlotFree(p, slot)) {
        return false;
    }
    if (item.equipment !== slot) {
        return false;
    }
    if (item.slot !== slot) {
        item.slot = slot;
    }
    const safeItemCopy = deepCloneObject(item);
    p.data.equipment.push(safeItemCopy);
    return true;
}
function isToolbarSlotFree(p, slot) {
    if (slot >= 4) {
        return false;
    }
    if (p.data.toolbar.length >= 4) {
        return false;
    }
    return p.data.toolbar.findIndex((item) => item.slot === slot) === -1 ? true : false;
}
function toolbarAdd(p, item, slot) {
    if (slot >= 4) {
        return false;
    }
    if (!isToolbarSlotFree(p, slot)) {
        return false;
    }
    if (item.slot !== slot) {
        item.slot = slot;
    }
    const safeItemCopy = deepCloneObject(item);
    p.data.toolbar.push(safeItemCopy);
    return true;
}
function toolbarRemove(p, slot) {
    if (slot >= 4) {
        return false;
    }
    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }
    p.data.toolbar.splice(index, 1);
    return true;
}
function replaceToolbarItem(p, item) {
    const itemIndex = p.data.toolbar.findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex <= -1) {
        return false;
    }
    p.data.toolbar[itemIndex] = item;
    return true;
}
function isInToolbar(p, item) {
    if (p.data.toolbar.length <= 0) {
        return null;
    }
    if (!item) {
        throw new Error(`[3L:RP] Specified item is null for isInToolbar`);
    }
    for (let i = 0; i < p.data.toolbar.length; i++) {
        const toolbarItem = p.data.toolbar[i];
        if (!toolbarItem) {
            continue;
        }
        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === toolbarItem[key]);
        if (keyIndex <= -1) {
            continue;
        }
        return { index: i };
    }
    return null;
}
function findAndRemove(player, itemName) {
    const toolbarItem = isInToolbar(player, { name: itemName });
    if (toolbarItem) {
        const item = player.data.toolbar[toolbarItem.index];
        if (!item) {
            return false;
        }
        const removedFromToolbar = toolbarRemove(player, item.slot);
        if (!removedFromToolbar) {
            return false;
        }
        save.field(player, 'toolbar', player.data.toolbar);
        sync.inventory(player);
        return true;
    }
    const inventoryItem = isInInventory(player, { name: itemName });
    if (!inventoryItem) {
        return false;
    }
    const item = player.data.inventory[inventoryItem.tab][inventoryItem.index];
    if (!item) {
        return false;
    }
    const removedFromInventory = inventoryRemove(player, item.slot, inventoryItem.tab);
    if (!removedFromInventory) {
        return false;
    }
    save.field(player, 'inventory', player.data.inventory);
    sync.inventory(player);
    return true;
}
function findItemBySlot(player, selectedSlot, tab) {
    if (selectedSlot.includes('i')) {
        const item = getInventoryItem(player, stripCategory(selectedSlot), tab);
        if (!item) {
            return null;
        }
        return {
            item: deepCloneObject(item),
            index: player.data.inventory[tab].findIndex((i) => i.slot === item.slot)
        };
    }
    if (selectedSlot.includes('e')) {
        const item = getEquipmentItem(player, stripCategory(selectedSlot));
        if (!item) {
            return null;
        }
        return { item: deepCloneObject(item), index: player.data.equipment.findIndex((i) => i.slot === item.slot) };
    }
    if (selectedSlot.includes('t')) {
        const item = getToolbarItem(player, stripCategory(selectedSlot));
        if (!item) {
            return null;
        }
        return { item: deepCloneObject(item), index: player.data.toolbar.findIndex((i) => i.slot === item.slot) };
    }
    return null;
}
function getSlotType(slot) {
    if (slot.includes('i'))
        return 'inventory';
    if (slot.includes('tab'))
        return 'tab';
    if (slot.includes('t'))
        return 'toolbar';
    if (slot.includes('g'))
        return 'ground';
    if (slot.includes('e'))
        return 'equipment';
    return null;
}
function saveFields(player, fields) {
    for (let i = 0; i < fields.length; i++)
        save.field(player, fields[i], player.data[fields[i]]);
    sync.inventory(player);
}
function handleSwapOrStack(player, selectedSlot, endSlot, tab, customItemRules) {
    const fieldsToSave = [];
    const selectItem = findItemBySlot(player, selectedSlot, tab);
    const endItem = findItemBySlot(player, endSlot, tab);
    if (!endItem || !selectItem) {
        console.log(`No end slot for this item... ${selectedSlot} to ${endSlot} at ${tab} (may be null)`);
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
    const selectedArray = isSelectInventory ? player.data[selectedSlotName][tab] : player.data[selectedSlotName];
    let endArray;
    if (selectedSlotName === endSlotName) {
        endArray = selectedArray;
    }
    else {
        endArray = isEndInventory ? player.data[endSlotName][tab] : player.data[endSlotName];
    }
    if (selectItem.item.name !== endItem.item.name) {
        if (!allItemRulesValid(player, selectItem.item, { name: endSlotName }, newEndSlot, customItemRules, tab)) {
            sync.inventory(player);
            return;
        }
        if (!allItemRulesValid(player, endItem.item, { name: selectedSlotName }, newSelectSlot, customItemRules, tab)) {
            sync.inventory(player);
            return;
        }
        selectedArray[selectIndex] = endItem.item;
        selectedArray[selectIndex].slot = newEndSlot;
        endArray[endIndex] = selectItem.item;
        endArray[endIndex].slot = newSelectSlot;
    }
    else {
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
        if (isSelectInventory) {
            player.data[selectedSlotName][tab] = selectedArray;
        }
        else {
            player.data[selectedSlotName] = selectedArray;
        }
        if (isEndInventory) {
            player.data[endSlotName][tab] = endArray;
        }
        else {
            player.data[endSlotName] = endArray;
        }
    }
    else {
        if (isSelectInventory) {
            player.data[selectedSlotName][tab] = selectedArray;
        }
        else {
            player.data[selectedSlotName] = selectedArray;
        }
        fieldsToSave.pop();
        emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }
    saveFields(player, fieldsToSave);
    sync.inventory(player);
}
function allItemRulesValid(player, item, endSlot, endSlotIndex, customItemRules, tab) {
    if (!item.behavior)
        return true;
    if (endSlot) {
        if (!isFlagEnabled(item.behavior, ItemType.CAN_DROP) && endSlot.name === InventoryType.GROUND)
            return false;
        if (!isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT)
            return false;
        if (!isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR) && endSlot.name === InventoryType.TOOLBAR)
            return false;
        if (isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT)
            if (!isEquipmentSlotValid(item, endSlotIndex))
                return false;
    }
    if (customItemRules.length >= 1) {
        for (let i = 0; i < customItemRules.length; i++) {
            if (!customItemRules[i](player, item, endSlot ? endSlot.name : null, endSlotIndex, tab))
                return false;
        }
    }
    return true;
}
function getAllItems(player) {
    let items = [];
    for (let i = 0; i < player.data.equipment.length; i++) {
        const item = deepCloneObject(player.data.equipment[i]);
        item.dataIndex = i;
        item.dataName = 'equipment';
        item.isEquipment = true;
        items.push(item);
    }
    for (let i = 0; i < player.data.toolbar.length; i++) {
        const item = deepCloneObject(player.data.toolbar[i]);
        item.dataIndex = i;
        item.dataName = 'toolbar';
        item.isToolbar = true;
        items.push(item);
    }
    player.data.inventory.forEach((tab, index) => {
        tab.forEach((originalItem, originalItemIndex) => {
            const item = deepCloneObject(originalItem);
            item.dataIndex = originalItemIndex;
            item.dataName = 'inventory';
            item.isInventory = true;
            item.dataTab = index;
            items.push(item);
        });
    });
    return items;
}
function stackInventoryItem(player, item) {
    const existingItem = isInInventory(player, item);
    if (!existingItem)
        return false;
    player.data.inventory[existingItem.tab][existingItem.index].quantity += item.quantity;
    save.field(player, 'inventory', player.data.inventory);
    sync.inventory(player);
    return true;
}
function getAllWeapons(player) {
    const weapons = getAllItems(player).filter((item) => isFlagEnabled(item.behavior, ItemType.IS_WEAPON));
    if (weapons.length <= 0)
        return [];
    return weapons;
}
function removeAllWeapons(player) {
    const weapons = getAllItems(player).filter((item) => isFlagEnabled(item.behavior, ItemType.IS_WEAPON));
    if (weapons.length <= 0)
        return [];
    const removedWeapons = [];
    for (let i = weapons.length - 1; i >= 0; i--) {
        if (weapons[i].isInventory) {
            removedWeapons.push(player.data[weapons[i].dataName][weapons[i].dataTab].splice(weapons[i].dataIndex, 1));
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
export default {
    allItemRulesValid,
    equipmentAdd,
    equipmentRemove,
    findAndRemove,
    getAllItems,
    getAllWeapons,
    getEquipmentItem,
    getFreeInventorySlot,
    getInventoryItem,
    getSlotType,
    getToolbarItem,
    handleSwapOrStack,
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
import('../../views/inventory').catch((err) => {
    throw err;
});
