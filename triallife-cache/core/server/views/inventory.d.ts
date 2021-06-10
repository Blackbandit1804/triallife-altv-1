import * as alt from 'alt-server';
import { DroppedItem, Item } from '../../shared/interfaces/Item';
import { CategoryData } from '../interface/category';
export declare class InventoryController {
    static groundItems: Array<DroppedItem>;
    static customItemRules: Array<Function>;
    static addItemRuleCheck(someFunction: Function): void;
    static processItemMovement(player: alt.Player, selectedSlot: string, endSlot: string, tab: number, hash: string | null): void;
    static handleMoveTabs(player: alt.Player, item: Item, selectSlotIndex: number, tab: number, tabToMoveTo: number, selectName: string, endName: string): void;
    static handleDropGround(player: alt.Player, selectedSlot: string, tab: number): void;
    static getDroppedItemsByGridSpace(gridSpace: number): Array<DroppedItem>;
    static updateDroppedItemsAroundPlayer(player: alt.Player, updateOtherPlayers: boolean): void;
    static handleProcessPickup(player: alt.Player, hash: string): void;
    static handlePickupGround(player: alt.Player, endData: CategoryData, endSlotIndex: number, hash: string | null, tab: number): void;
    static processUse(player: alt.Player, selectedSlot: string, tab: number): void;
    static processSplit(player: alt.Player, selectedSlot: string, tab: number, amount: number): void;
}
