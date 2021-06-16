import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/player';
import { ItemType } from '../../shared/enums/item-type';
import { Item } from '../../shared/interfaces/item';

const teleporterItem: Item = {
    name: `Teleporter`,
    uuid: `teleporter`,
    description: `Debug: Should be able to call an event with this`,
    icon: 'teleporter',
    slot: 5,
    quantity: 1,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CONSUMABLE,
    data: { event: 'effect:Teleport' }
};

alt.on('effect:Teleport', (player: alt.Player, item: Item) => {
    if (!item || !item.data || !item.data.x || !item.data.y || !item.data.z) return;
    playerFuncs.safe.setPosition(player, item.data.x, item.data.y, item.data.z);
    playerFuncs.emit.sound3D(player, 'item_teleport', player);
});
