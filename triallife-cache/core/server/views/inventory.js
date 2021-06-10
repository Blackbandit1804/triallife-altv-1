import * as alt from 'alt-server';
import { InventoryType, ItemType, SYSTEM_EVENTS, View_Events_Inventory } from '../../shared/utility/enums';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/player';
import { sha256Random } from '../utility/encryption';
import { EVENTS_PLAYER } from '../enums';
import { distance2d } from '../utility/vector';
import { stripCategory } from '../utility/category';
import { deepCloneObject } from '../../shared/utility/deepCopy';
export class InventoryController {
    static groundItems = [];
    static customItemRules = [];
    static addItemRuleCheck(someFunction) {
        InventoryController.customItemRules.push(someFunction);
    }
    static processItemMovement(player, selectedSlot, endSlot, tab, hash) {
        if (!player || !player.valid) {
            return;
        }
        if (selectedSlot === endSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const endData = DataHelpers.find((dataInfo) => endSlot.includes(dataInfo.abbrv));
        const endSlotIndex = stripCategory(endSlot);
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
        if (selectData.name === InventoryType.TOOLBAR && endData.name !== InventoryType.TOOLBAR) {
            player.removeAllWeapons();
        }
        if (endData.name === InventoryType.GROUND) {
            InventoryController.handleDropGround(player, selectedSlot, tab);
            return;
        }
        if (selectData.name === InventoryType.GROUND) {
            InventoryController.handlePickupGround(player, endData, endSlotIndex, hash, tab);
            return;
        }
        if (endData.emptyCheck && !endData.emptyCheck(player, endSlotIndex, tab)) {
            playerFuncs.inventory.handleSwapOrStack(player, selectedSlot, endSlot, tab, InventoryController.customItemRules);
            return;
        }
        const selectSlotIndex = stripCategory(selectedSlot);
        const itemClone = selectData.getItem(player, selectSlotIndex, tab);
        if (!itemClone) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (endData.name === InventoryType.TAB) {
            InventoryController.handleMoveTabs(player, itemClone, selectSlotIndex, tab, endSlotIndex, selectData.name, endData.name);
            return;
        }
        if (!playerFuncs.inventory.allItemRulesValid(player, itemClone, endData, endSlotIndex, InventoryController.customItemRules, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const isEquipmentItem = isFlagEnabled(itemClone.behavior, ItemType.IS_EQUIPMENT);
        if (isEquipmentItem && itemClone.data.sex !== player.data.design.sex) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const didRemoveItem = selectData.removeItem(player, itemClone.slot, tab);
        if (!didRemoveItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const didAddItem = endData.addItem(player, itemClone, endSlotIndex, tab);
        if (!didAddItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        playerFuncs.save.field(player, selectData.name, player.data[selectData.name]);
        playerFuncs.save.field(player, endData.name, player.data[endData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }
    static handleMoveTabs(player, item, selectSlotIndex, tab, tabToMoveTo, selectName, endName) {
        const freeSlot = playerFuncs.inventory.getFreeInventorySlot(player, tabToMoveTo);
        if (!freeSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!playerFuncs.inventory.inventoryRemove(player, selectSlotIndex, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!playerFuncs.inventory.inventoryAdd(player, item, freeSlot.slot, freeSlot.tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        playerFuncs.save.field(player, selectName, player.data[selectName]);
        playerFuncs.save.field(player, endName, player.data[endName]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }
    static handleDropGround(player, selectedSlot, tab) {
        const selectSlotIndex = stripCategory(selectedSlot);
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
        if (selectData.name === InventoryType.GROUND) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const itemClone = selectData.getItem(player, selectSlotIndex, tab);
        if (player.vehicle) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!itemClone) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!isFlagEnabled(itemClone.behavior, ItemType.CAN_DROP)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!playerFuncs.inventory.allItemRulesValid(player, itemClone, { name: 'ground' }, null, InventoryController.customItemRules, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const didRemoveItem = selectData.removeItem(player, itemClone.slot, tab);
        if (!didRemoveItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        playerFuncs.save.field(player, selectData.name, player.data[selectData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_drop_1', Math.random() * 0.45 + 0.1);
        if (isFlagEnabled(itemClone.behavior, ItemType.DESTROY_ON_DROP)) {
            playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
            playerFuncs.emit.notification(player, `${itemClone.name} was destroyed on drop.`);
            return;
        }
        itemClone.hash = sha256Random(JSON.stringify(itemClone));
        InventoryController.groundItems.push({
            gridSpace: player.gridSpace,
            item: itemClone,
            position: playerFuncs.utility.getPositionFrontOf(player, 1),
            dimension: player.dimension
        });
        this.updateDroppedItemsAroundPlayer(player, true);
        playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
        alt.emit(EVENTS_PLAYER.DROPPED_ITEM, player, itemClone);
    }
    static getDroppedItemsByGridSpace(gridSpace) {
        return InventoryController.groundItems.filter((item) => item.gridSpace === gridSpace);
    }
    static updateDroppedItemsAroundPlayer(player, updateOtherPlayers) {
        let players = [player];
        if (updateOtherPlayers) {
            players = playerFuncs.utility.getClosestPlayers(player, 50);
        }
        const items = InventoryController.getDroppedItemsByGridSpace(player.gridSpace);
        for (let i = 0; i < players.length; i++) {
            const target = players[i];
            if (!target || !target.valid) {
                continue;
            }
            alt.emitClient(target, SYSTEM_EVENTS.POPULATE_ITEMS, items);
        }
    }
    static handleProcessPickup(player, hash) {
        const openSlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const endData = DataHelpers.find((dataInfo) => 'i-'.includes(dataInfo.abbrv));
        if (!endData) {
            playerFuncs.sync.inventory(player);
            return;
        }
        InventoryController.handlePickupGround(player, endData, openSlot.slot, hash, openSlot.tab);
    }
    static handlePickupGround(player, endData, endSlotIndex, hash, tab) {
        if (player.vehicle) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!endData.emptyCheck(player, endSlotIndex, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!hash) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const index = InventoryController.groundItems.findIndex((gItem) => gItem.item.hash === hash);
        if (index <= -1) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        const droppedItem = { ...InventoryController.groundItems[index] };
        if (distance2d(player.pos, droppedItem.position) >= 10) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        if (!playerFuncs.inventory.allItemRulesValid(player, droppedItem.item, endData, endSlotIndex, InventoryController.customItemRules, tab)) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        const isEquipmentItem = isFlagEnabled(droppedItem.item.behavior, ItemType.IS_EQUIPMENT);
        const isGoingToEquipment = endData.name === InventoryType.EQUIPMENT;
        if (isEquipmentItem && isGoingToEquipment && droppedItem.item.data.sex !== player.data.design.sex) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        const removedItems = InventoryController.groundItems.splice(index, 1);
        if (removedItems.length <= 0) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        const didAddItem = endData.addItem(player, droppedItem.item, endSlotIndex, tab);
        if (!didAddItem) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        playerFuncs.save.field(player, endData.name, player.data[endData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
        playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
        this.updateDroppedItemsAroundPlayer(player, true);
    }
    static processUse(player, selectedSlot, tab) {
        if (!selectedSlot || tab === undefined || tab === null) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const slot = stripCategory(selectedSlot);
        if (isNaN(slot)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const slotType = playerFuncs.inventory.getSlotType(selectedSlot);
        const originalItem = slotType.includes('inventory')
            ? player.data[slotType][tab].find((i) => i && i.slot === slot)
            : player.data[slotType].find((i) => i && i.slot === slot);
        if (!originalItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const item = deepCloneObject(originalItem);
        if (item.equipment !== undefined && item.equipment !== null) {
            if (selectedSlot.includes('t-')) {
                playerFuncs.sync.inventory(player);
                return;
            }
            if (selectedSlot.includes('e-')) {
                const openSlot = playerFuncs.inventory.getFreeInventorySlot(player);
                if (!openSlot) {
                    playerFuncs.sync.inventory(player);
                    return;
                }
                if (!playerFuncs.inventory.equipmentRemove(player, item.equipment)) {
                    playerFuncs.sync.inventory(player);
                    return;
                }
                playerFuncs.inventory.inventoryAdd(player, item, openSlot.slot, openSlot.tab);
            }
            else {
                if (!playerFuncs.inventory.inventoryRemove(player, item.slot, tab)) {
                    playerFuncs.sync.inventory(player);
                    return;
                }
                let removedItem;
                const targetSlotIndex = player.data.equipment.findIndex((i) => i && i.equipment === item.equipment);
                if (targetSlotIndex >= 0) {
                    removedItem = deepCloneObject(player.data.equipment[targetSlotIndex]);
                    if (!playerFuncs.inventory.equipmentRemove(player, item.equipment)) {
                        playerFuncs.sync.inventory(player);
                        return;
                    }
                    playerFuncs.inventory.inventoryAdd(player, removedItem, item.slot, tab);
                }
                playerFuncs.inventory.equipmentAdd(player, item, item.equipment);
            }
            playerFuncs.save.field(player, 'equipment', player.data.equipment);
            playerFuncs.save.field(player, 'inventory', player.data.inventory);
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!isFlagEnabled(item.behavior, ItemType.CONSUMABLE)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!isFlagEnabled(item.behavior, ItemType.SKIP_CONSUMABLE)) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                playerFuncs.inventory.inventoryRemove(player, slot, tab);
            }
            else {
                playerFuncs.inventory.replaceInventoryItem(player, item, tab);
            }
            playerFuncs.save.field(player, 'inventory', player.data.inventory);
            playerFuncs.sync.inventory(player);
        }
        if (item.data && item.data.event) {
            alt.emit(item.data.event, player, item, slot, tab);
            playerFuncs.emit.sound2D(player, 'item_use', Math.random() * 0.45 + 0.1);
        }
    }
    static processSplit(player, selectedSlot, tab, amount) {
        if (isNaN(amount)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (amount <= 0) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!selectedSlot.includes('i-')) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const currentSlotValue = stripCategory(selectedSlot);
        const index = player.data.inventory[tab].findIndex((i) => i && i.slot === currentSlotValue);
        if (index <= -1) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const inventorySlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!inventorySlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const clonedItem = deepCloneObject(player.data.inventory[tab][index]);
        if (clonedItem.quantity < amount) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (amount >= clonedItem.quantity) {
            playerFuncs.sync.inventory(player);
            return;
        }
        player.data.inventory[tab][index].quantity -= amount;
        clonedItem.quantity = amount;
        playerFuncs.inventory.inventoryAdd(player, clonedItem, inventorySlot.slot, inventorySlot.tab);
        playerFuncs.save.field(player, 'inventory', player.data.inventory);
        playerFuncs.sync.inventory(player);
    }
}
const DataHelpers = [
    {
        abbrv: 'i-',
        name: 'inventory',
        emptyCheck: playerFuncs.inventory.isInventorySlotFree,
        getItem: playerFuncs.inventory.getInventoryItem,
        removeItem: playerFuncs.inventory.inventoryRemove,
        addItem: playerFuncs.inventory.inventoryAdd
    },
    {
        abbrv: 't-',
        name: 'toolbar',
        emptyCheck: playerFuncs.inventory.isToolbarSlotFree,
        getItem: playerFuncs.inventory.getToolbarItem,
        removeItem: playerFuncs.inventory.toolbarRemove,
        addItem: playerFuncs.inventory.toolbarAdd
    },
    {
        abbrv: 'e-',
        name: 'equipment',
        emptyCheck: playerFuncs.inventory.isEquipmentSlotFree,
        getItem: playerFuncs.inventory.getEquipmentItem,
        removeItem: playerFuncs.inventory.equipmentRemove,
        addItem: playerFuncs.inventory.equipmentAdd
    },
    { abbrv: 'g-', name: 'ground', emptyCheck: null, getItem: null, removeItem: null, addItem: null },
    {
        abbrv: 'tab-',
        name: 'tab',
        emptyCheck: null,
        getItem: null,
        removeItem: null,
        addItem: null
    }
];
alt.onClient(View_Events_Inventory.Use, InventoryController.processUse);
alt.onClient(View_Events_Inventory.Process, InventoryController.processItemMovement);
alt.onClient(View_Events_Inventory.Split, InventoryController.processSplit);
alt.onClient(View_Events_Inventory.Pickup, InventoryController.handleProcessPickup);
