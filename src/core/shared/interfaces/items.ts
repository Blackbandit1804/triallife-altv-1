import { ItemType, EffectType } from '../utility/enums';
import { Item } from '../interfaces/Item';
import { deepCloneObject } from '../utility/usefull';

export const Items: Array<Item> = [
    {
        name: `Burger`,
        description: `Ein leckerer Burger, der deine Arterien verstopft.`,
        icon: 'burger',
        slot: 0,
        quantity: 1,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CAN_STACK | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: { event: EffectType.EAT, amount: 5, sound: 'item_eat' }
    },
    {
        name: `Bread`,
        description: `Ein ganzes Brot. Es hat 5 Scheiben`,
        icon: 'bread',
        slot: 0,
        quantity: 5,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CAN_STACK | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: { event: EffectType.EAT, amount: 3, sound: 'item_eat' }
    },
    {
        name: `Repair Kit`,
        description: `A toolkit to repair a vehicle.`,
        icon: 'toolbox',
        slot: 0,
        quantity: 1,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE | ItemType.SKIP_CONSUMABLE,
        data: { event: EffectType.REPAIR_VEHICLE }
    }
];

export function appendToItems(item: Item) {
    Items.push(item);
}

export function getFromItems(name: string): Item | null {
    const index = Items.findIndex((itemRef) => itemRef.name.toLowerCase().includes(name));
    if (index <= -1) return null;
    return deepCloneObject<Item>(Items[index]);
}
