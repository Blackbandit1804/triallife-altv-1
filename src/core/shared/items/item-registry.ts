import { ItemType } from '../enums/item-type';
import { Item } from '../interfaces/item';
import { deepCloneObject } from '../utility/deep-copy';
import EFFECTS from '../enums/effects';

export const ItemRegistry: Array<Item> = [
    {
        name: `Burger`,
        description: `A delicious burger that packs your arteries.`,
        icon: 'burger',
        slot: 0,
        quantity: 1,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.CAN_STACK | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
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
            event: EFFECTS.EFFECT_FOOD,
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
        data: {
            event: 'effect:Vehicle:Repair'
        }
    }
];

/**
 * Used to add items to the server-side item registry.
 * Has no purpose on client-side and items that are pushed late are inaccessible on client-side.
 * If you wish to access items on client-side you will need to add them to the ItemRegistry array.
 * @export
 * @param {Item} item
 */
export function appendToItemRegistry(item: Item) {
    ItemRegistry.push(item);
}

/**
 * Returns a deep cloned item from the registry.
 * @export
 * @param {string} name
 * @return {*}  {(Item | null)}
 */
export function getFromRegistry(name: string): Item | null {
    const index = ItemRegistry.findIndex((itemRef) => itemRef.name.toLowerCase().includes(name));
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(ItemRegistry[index]);
}
