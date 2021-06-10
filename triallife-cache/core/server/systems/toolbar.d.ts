import * as alt from 'alt-server';
import { Item } from '../../shared/interfaces/Item';
export declare class ToolbarController {
    static handleToolbarChange(player: alt.Player, slot: number): void;
    static handleWeaponEquip(player: alt.Player, item: Item): void;
    static handleToolbarUse(player: alt.Player, item: Item): void;
}
