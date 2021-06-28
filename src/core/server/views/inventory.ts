import * as alt from 'alt-server';
import { InventoryType, ItemType, SystemEvent, ViewEvent } from '../../shared/utility/enums';
import { DroppedItem, Item } from '../../shared/interfaces/Item';
import { isFlagEnabled, deepCloneObject } from '../../shared/utility/usefull';
import { playerFuncs } from '../extensions/Player';
import { sha256Random, stripCategory } from '../utility/usefull';
import { distance2d } from '../utility/vector';
import { CategoryData } from '../interfaces/category-data';
import { TlrpEvent } from '../utility/enums';

export class InventoryManager {
    static groundItems: Array<DroppedItem> = [];
    static customItemRules: Array<Function> = [];

    static addItemRuleCheck(someFunction: Function) {
        InventoryManager.customItemRules.push(someFunction);
    }

    static processItemMovement(player: alt.Player, selectedSlot: string, endSlot: string, hash: string | null): void {
        if (!player || !player.valid) return;
        if (selectedSlot === endSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const endData = DataHelpers.find((dataInfo) => endSlot.includes(dataInfo.abbrv));
        const endSlotIndex = stripCategory(endSlot);
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
        if (selectData.name === InventoryType.TOOLBAR && endData.name !== InventoryType.TOOLBAR) player.removeAllWeapons();
        if (endData.name === InventoryType.GROUND) {
            InventoryManager.handleDropGround(player, selectedSlot);
            return;
        }
        if (selectData.name === InventoryType.GROUND) {
            InventoryManager.handlePickupGround(player, endData, endSlotIndex, hash);
            return;
        }
        if (endData.emptyCheck && !endData.emptyCheck(player, endSlotIndex)) {
            playerFuncs.inventory.swapOrStack(player, selectedSlot, endSlot, InventoryManager.customItemRules);
            return;
        }
        const selectSlotIndex = stripCategory(selectedSlot);
        const itemClone: Item = selectData.getItem(player, selectSlotIndex);
        if (!itemClone) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!playerFuncs.inventory.allItemRulesValid(player, itemClone, endData, endSlotIndex, InventoryManager.customItemRules)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const isEquipmentItem = isFlagEnabled(itemClone.behavior, ItemType.IS_EQUIPMENT);
        if (isEquipmentItem && itemClone.data.sex !== player.data.design.sex) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const didRemoveItem = selectData.removeItem(player, itemClone.slot);
        if (!didRemoveItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const didAddItem = endData.addItem(player, itemClone, endSlotIndex);
        if (!didAddItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        playerFuncs.save.field(player, selectData.name, player.data[selectData.name]);
        playerFuncs.save.field(player, endData.name, player.data[endData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    static handleDropGround(player: alt.Player, selectedSlot: string) {
        const selectSlotIndex = stripCategory(selectedSlot);
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
        if (selectData.name === InventoryType.GROUND) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const itemClone: Item = selectData.getItem(player, selectSlotIndex);
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
        if (!playerFuncs.inventory.allItemRulesValid(player, itemClone, { name: 'ground' }, null, InventoryManager.customItemRules)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const didRemoveItem = selectData.removeItem(player, itemClone.slot);
        if (!didRemoveItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        playerFuncs.save.field(player, selectData.name, player.data[selectData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_drop_1', Math.random() * 0.45 + 0.1);
        if (isFlagEnabled(itemClone.behavior, ItemType.DESTROY_ON_DROP)) {
            playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
            playerFuncs.emit.message(player, `${itemClone.name} was destroyed on drop.`);
            return;
        }
        itemClone.hash = sha256Random(JSON.stringify(itemClone));
        InventoryManager.groundItems.push({ gridSpace: player.gridSpace, item: itemClone, position: playerFuncs.utility.getPositionFrontOf(player, 1), dimension: player.dimension });
        this.updateDroppedItemsAroundPlayer(player, true);
        playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
        alt.emit(TlrpEvent.PLAYER_DROPPED_ITEM, player, itemClone);
    }

    static getDroppedItemsByGridSpace(gridSpace: number): Array<DroppedItem> {
        return InventoryManager.groundItems.filter((item) => item.gridSpace === gridSpace);
    }

    static updateDroppedItemsAroundPlayer(player: alt.Player, updateOtherPlayers: boolean): void {
        let players = [player];
        if (updateOtherPlayers) players = playerFuncs.utility.getClosestPlayers(player, 50);
        const items = InventoryManager.getDroppedItemsByGridSpace(player.gridSpace);
        for (let i = 0; i < players.length; i++) {
            const target = players[i];
            if (!target || !target.valid) continue;
            alt.emitClient(target, SystemEvent.Items_Populate, items);
        }
    }

    static handleProcessPickup(player: alt.Player, hash: string) {
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
        InventoryManager.handlePickupGround(player, endData, openSlot.slot, hash);
    }

    static handlePickupGround(player: alt.Player, endData: CategoryData, endSlotIndex: number, hash: string | null) {
        if (player.vehicle) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!endData.emptyCheck(player, endSlotIndex)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (!hash) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const index = InventoryManager.groundItems.findIndex((gItem) => gItem.item.hash === hash);
        if (index === -1) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        const droppedItem: DroppedItem = { ...InventoryManager.groundItems[index] };
        if (distance2d(player.pos, droppedItem.position) >= 10) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }
        if (!playerFuncs.inventory.allItemRulesValid(player, droppedItem.item, endData, endSlotIndex, InventoryManager.customItemRules)) {
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
        const removedItems = InventoryManager.groundItems.splice(index, 1);
        if (removedItems.length <= 0) {
            playerFuncs.sync.inventory(player);
            this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }

        const didAddItem = endData.addItem(player, droppedItem.item, endSlotIndex);
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

    static processUse(player: alt.Player, selectedSlot: string) {
        if (!selectedSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const slot = stripCategory(selectedSlot);
        if (isNaN(slot)) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const slotType = playerFuncs.inventory.getSlotType(selectedSlot);
        const originalItem = slotType.includes('inventory') ? player.data[slotType].items.find((i) => i && i.slot === slot) : player.data[slotType].find((i) => i && i.slot === slot);
        if (!originalItem) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const item = deepCloneObject(originalItem) as Item;
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
                playerFuncs.inventory.inventoryAdd(player, item, openSlot.slot);
            } else {
                if (!playerFuncs.inventory.inventoryRemove(player, item.slot)) {
                    playerFuncs.sync.inventory(player);
                    return;
                }
                let removedItem: Item;
                const targetSlotIndex = player.data.equipment.findIndex((i) => i && i.equipment === item.equipment);
                if (targetSlotIndex >= 0) {
                    removedItem = deepCloneObject(player.data.equipment[targetSlotIndex]);
                    if (!playerFuncs.inventory.equipmentRemove(player, item.equipment)) {
                        playerFuncs.sync.inventory(player);
                        return;
                    }
                    playerFuncs.inventory.inventoryAdd(player, removedItem, item.slot);
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
            if (item.quantity <= 0) playerFuncs.inventory.inventoryRemove(player, slot);
            else playerFuncs.inventory.replaceInventoryItem(player, item);
            playerFuncs.save.field(player, 'inventory', player.data.inventory);
            playerFuncs.sync.inventory(player);
        }

        if (item.data && item.data.event) {
            alt.emit(item.data.event, player, item, slot);
            playerFuncs.emit.sound2D(player, 'item_use', Math.random() * 0.45 + 0.1);
        }
    }

    static processSplit(player: alt.Player, selectedSlot: string, amount: number) {
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
        const index = player.data.inventory.items.findIndex((i) => i && i.slot === currentSlotValue);
        if (index === -1) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const inventorySlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!inventorySlot) {
            playerFuncs.sync.inventory(player);
            return;
        }
        const clonedItem = deepCloneObject(player.data.inventory.items[index]) as Item;
        if (clonedItem.quantity < amount) {
            playerFuncs.sync.inventory(player);
            return;
        }
        if (amount >= clonedItem.quantity) {
            playerFuncs.sync.inventory(player);
            return;
        }
        player.data.inventory.items[index].quantity -= amount;
        clonedItem.quantity = amount;
        playerFuncs.inventory.inventoryAdd(player, clonedItem, inventorySlot.slot);
        playerFuncs.save.field(player, 'inventory', player.data.inventory);
        playerFuncs.sync.inventory(player);
    }
}

const DataHelpers: Array<CategoryData> = [
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
    { abbrv: 'g-', name: 'ground', emptyCheck: null, getItem: null, removeItem: null, addItem: null }
];

alt.onClient(ViewEvent.Inventory_Use, InventoryManager.processUse);
alt.onClient(ViewEvent.Inventory_Process, InventoryManager.processItemMovement);
alt.onClient(ViewEvent.Inventory_Split, InventoryManager.processSplit);
alt.onClient(ViewEvent.Inventory_Pickup, InventoryManager.handleProcessPickup);
