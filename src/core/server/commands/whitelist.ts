import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatManager from '../systems/chat';
import { OptionsManager } from '../systems/options';

ChatManager.addCommand(
    'addwhitelist',
    LocaleManager.get(LOCALE_KEYS.COMMAND_ADD_WHITELIST, '/addwhitelist'),
    Permissions.Admin | Permissions.Moderator,
    handleCommandAdd
);

ChatManager.addCommand(
    'removewhitelist',
    LocaleManager.get(LOCALE_KEYS.COMMAND_REMOVE_WHITELIST, '/removewhitelist'),
    Permissions.Admin | Permissions.Moderator,
    handleCommandRemove
);

async function handleCommandAdd(player: alt.Player, discord: string): Promise<void> {
    if (!discord) {
        playerFuncs.emit.message(player, ChatManager.getDescription('addwhitelist'));
        return;
    }

    if (discord.length <= 17) {
        playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH));
        return;
    }

    const didAdd = OptionsManager.addToWhitelist(discord);
    if (!didAdd) {
        playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.DISCORD_ALREADY_WHITELISTED, discord));
        return;
    }

    playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.DISCORD_ADDED_WHITELIST, discord));
}

async function handleCommandRemove(player: alt.Player, discord: string): Promise<void> {
    if (!discord) {
        playerFuncs.emit.message(player, ChatManager.getDescription('removewhitelist'));
        return;
    }

    if (discord.length <= 17) {
        playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH));
        return;
    }

    const didRemove = OptionsManager.removeFromWhitelist(discord);
    if (!didRemove) {
        playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.DISCORD_NOT_WHITELISTED, discord));
        return;
    }

    playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.DISCORD_REMOVED_WHITELIST, discord));
}
