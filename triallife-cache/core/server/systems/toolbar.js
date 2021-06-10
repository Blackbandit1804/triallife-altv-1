import * as alt from 'alt-server';
import { ItemType } from '../../shared/enums/itemType';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/Player';
export class ToolbarController {
    static handleToolbarChange(player, slot) {
        if (slot <= -1 || slot >= 4) {
            return;
        }
        const item = playerFuncs.inventory.getToolbarItem(player, slot);
        if (!item) {
            playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_NOT_EQUIPPED));
            return;
        }
        if (!isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR)) {
            return;
        }
        if (isFlagEnabled(item.behavior, ItemType.IS_WEAPON)) {
            ToolbarController.handleWeaponEquip(player, item);
            return;
        }
        if (isFlagEnabled(item.behavior, ItemType.CONSUMABLE)) {
            ToolbarController.handleToolbarUse(player, item);
            return;
        }
    }
    static handleWeaponEquip(player, item) {
        player.removeAllWeapons();
        if (!item.data.hash) {
            playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.WEAPON_NO_HASH));
            return;
        }
        if (!player.lastToolbarData) {
            player.lastToolbarData = { equipped: true, slot: item.slot };
            player.giveWeapon(item.data.hash, 9999, true);
            playerFuncs.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }
        if (player.lastToolbarData.slot !== item.slot) {
            player.lastToolbarData = { equipped: true, slot: item.slot };
            player.giveWeapon(item.data.hash, 9999, true);
            playerFuncs.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }
        if (!player.lastToolbarData.equipped) {
            player.giveWeapon(item.data.hash, 9999, true);
            player.lastToolbarData.equipped = true;
            playerFuncs.emit.sound3D(player, 'item_equip', player);
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_RELOAD);
            return;
        }
        player.lastToolbarData.equipped = false;
        playerFuncs.emit.sound3D(player, 'item_remove', player);
    }
    static handleToolbarUse(player, item) {
        if (!isFlagEnabled(item.behavior, ItemType.SKIP_CONSUMABLE)) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                playerFuncs.inventory.toolbarRemove(player, item.slot);
            }
            else {
                playerFuncs.inventory.replaceToolbarItem(player, item);
            }
            playerFuncs.sync.inventory(player);
            playerFuncs.save.field(player, 'toolbar', player.data.toolbar);
        }
        if (item.data && item.data.event) {
            alt.emit(item.data.event, player, item);
            playerFuncs.emit.sound2D(player, 'item_use', Math.random() * 0.45 + 0.1);
        }
    }
}
alt.onClient(SYSTEM_EVENTS.PLAYER_TOOLBAR_SET, ToolbarController.handleToolbarChange);