import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/player';
import { ClothingComponent } from '../../shared/interfaces/clothing';
import { Item } from '../../shared/interfaces/item';
import { ItemType, ViewEvent } from '../../shared/utility/enums';
import { deepCloneObject } from '../../shared/utility/usefull';

alt.onClient(ViewEvent.Clothing_Exit, handleExit);
alt.onClient(ViewEvent.Clothing_Purchase, handlePurchase);

const icons = ['hat', 'mask', 'shirt', 'bottoms', 'shoes', 'glasses', 'ear', 'backpack', 'armour', 'watch', 'bracelet'];

const wearableRef: Item = {
    name: `Item`,
    description: `An Item`,
    icon: 'crate',
    slot: 0,
    quantity: 1,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_EQUIPMENT,
    data: {}
};

function handleExit(player: alt.Player) {
    playerFuncs.sync.inventory(player);
}

function handlePurchase(player: alt.Player, equipmentSlot: number, component: ClothingComponent, name: string, desc: string) {
    const newItem = deepCloneObject<Item>(wearableRef);
    newItem.name = name;
    newItem.description = desc;
    newItem.data = { ...component };
    newItem.data.sex = player.data.design.sex;
    newItem.slot = equipmentSlot;
    newItem.icon = icons[equipmentSlot];
    newItem.quantity = 1;
    newItem.equipment = equipmentSlot;
    let didGetAdded = false;
    if (playerFuncs.inventory.isEquipmentSlotFree(player, equipmentSlot)) {
        didGetAdded = playerFuncs.inventory.equipmentAdd(player, newItem, equipmentSlot);
        alt.log('item added to equipment: ' + didGetAdded + ' for ' + player.discord.username);
    } else {
        const openSlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            alt.log('no free inventory slot found for ' + player.discord.username);
            playerFuncs.emit.sound2D(player, 'item_error');
            return;
        }
        playerFuncs.emit.message(player, 'Gegenstand wurde hinzugefügt');
        didGetAdded = playerFuncs.inventory.inventoryAdd(player, newItem, openSlot.slot);
        alt.log('item added to inventory: ' + didGetAdded + ' for ' + player.discord.username);
    }
    if (!didGetAdded) {
        alt.log('item not added from shop for ' + player.discord.username);
        playerFuncs.emit.sound2D(player, 'item_error');
        return;
    }
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.save.field(player, 'equipment', player.data.equipment);
    playerFuncs.sync.inventory(player);
    playerFuncs.emit.sound2D(player, 'item_purchase');
}
