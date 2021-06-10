import { ItemTypes, EffectTypes } from './enums';
import { Item } from '../interfaces/item';
import { deepCloneObject } from './usefull';

export const Items: Array<Item> = [
    {
        name: `Burger`,
        description: `A delicious burger that packs your arteries.`,
        icon: 'burger',
        slot: 0,
        quantity: 1,
        behavior: ItemTypes.CAN_DROP | ItemTypes.CAN_TRADE | ItemTypes.CAN_STACK | ItemTypes.IS_TOOLBAR | ItemTypes.CONSUMABLE,
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
        behavior: ItemTypes.CAN_DROP | ItemTypes.CAN_TRADE | ItemTypes.CAN_STACK | ItemTypes.IS_TOOLBAR | ItemTypes.CONSUMABLE,
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
        behavior: ItemTypes.CAN_DROP | ItemTypes.CAN_TRADE | ItemTypes.IS_TOOLBAR | ItemTypes.CONSUMABLE | ItemTypes.SKIP_CONSUMABLE,
        data: {
            event: 'effect:Vehicle:Repair'
        }
    }
];

export function appendToItemRegistry(item: Item) {
    Items.push(item);
}

export function getFromRegistry(name: string): Item | null {
    const index = Items.findIndex((itemRef) => itemRef.name.toLowerCase().includes(name));
    if (index <= -1) return null;
    return deepCloneObject<Item>(Items[index]);
}
