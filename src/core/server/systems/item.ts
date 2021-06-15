import { ItemType } from '../../shared/enums/item-type';
import { Item } from '../../shared/interfaces/item';
import { deepCloneObject } from '../../shared/utility/deep-copy';

export class ItemFactory {
    /**
     * Creates a new item with a hash.
     * @static
     * @param {string} name The name of the item.
     * @param {string} description The description of this item.
     * @param {string} icon The corresponding item icon for this item.
     * @param {number} quantity The number or amount of stacked items in this item.
     * @param {ItemType} behavior General item behavior of this item.
     * @param {{ [key: string]: any }} data
     * @return {*}  {Item}
     * @memberof ItemFactory
     */
    static create(name: string, description: string, icon: string, quantity: number, behavior: ItemType, data: { [key: string]: any }, slot: number): Item | null {
        if (slot <= -1) {
            return null;
        }

        const item: Item = {
            name,
            description,
            icon,
            quantity,
            behavior,
            data,
            slot
        };

        if (item.quantity <= -1) {
            item.quantity = 1;
        }

        return item;
    }

    /**
     * Creates an exact clone of an item but gives it a new hash.
     * @static
     * @param {Item} item
     * @return {*}  {Item}
     * @memberof ItemFactory
     */
    static clone(item: Item): Item {
        const newItem: Item = deepCloneObject(item);
        return newItem;
    }
}
