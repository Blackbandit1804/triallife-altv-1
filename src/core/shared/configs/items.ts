import { Item } from '../interfaces/item';
import { deepCloneObject } from '../utility/deepCopy';
import { EffectTypes, ItemType } from '../utility/enums';

export const ItemRegistry: Array<Item> = [
    {
        name: `Burger`,
        description: `A delicious burger that packs your arteries.`,
        icon: 'burger',
        slot: 0,
        quantity: 1,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CAN_STACK | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: {
            event: EffectTypes.EFFECT_FOOD,
            amount: 5,
            sound: 'item_eat'
        }
    },
    {
        name: `Bread`,
        description: `An entire loaf of bread. It has 5 slices.`,
        icon: 'bread',
        slot: 0,
        quantity: 5,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CAN_STACK | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: {
            event: EffectTypes.EFFECT_FOOD,
            amount: 3,
            sound: 'item_eat'
        }
    },
    {
        name: `Repair Kit`,
        description: `A toolkit to repair a vehicle.`,
        icon: 'toolbox',
        slot: 0,
        quantity: 1,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE | ItemType.SKIP_CONSUMABLE,
        data: { event: 'effect:Vehicle:Repair' }
    }
];

export function appendToItemRegistry(item: Item) {
    ItemRegistry.push(item);
}

export function getFromRegistry(name: string): Item | null {
    const index = ItemRegistry.findIndex((itemRef) => itemRef.name.toLowerCase().includes(name));
    if (index <= -1) return null;
    return deepCloneObject<Item>(ItemRegistry[index]);
}
