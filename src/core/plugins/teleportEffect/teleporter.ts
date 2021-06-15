import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import ChatManager from '../../server/systems/chat';
import { ItemType } from '../../shared/enums/item-type';
import { Permissions } from '../../shared/flags/permissions';
import { Item } from '../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { deepCloneObject } from '../../shared/utility/deep-copy';

const teleporterItem: Item = {
    name: `Teleporter`,
    uuid: `teleporter`,
    description: `Debug: Should be able to call an event with this`,
    icon: 'teleporter',
    slot: 5,
    quantity: 1,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CONSUMABLE,
    data: {
        event: 'effect:Teleport'
    }
};

ChatManager.addCommand('teleporter', LocaleManager.get(LOCALE_KEYS.COMMAND_TELEPORTER, '/teleporter'), Permissions.Admin, (player: alt.Player) => {
    let itemClone = deepCloneObject<Item>(teleporterItem);
    let slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    itemClone.data.x = player.pos.x;
    itemClone.data.y = player.pos.y;
    itemClone.data.z = player.pos.z;

    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
});

alt.on('effect:Teleport', (player: alt.Player, item: Item) => {
    if (!item || !item.data || !item.data.x || !item.data.y || !item.data.z) {
        return;
    }

    playerFuncs.safe.setPosition(player, item.data.x, item.data.y, item.data.z);
    playerFuncs.emit.sound3D(player, 'item_teleport', player);
});
