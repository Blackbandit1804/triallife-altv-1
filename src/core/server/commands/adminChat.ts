import * as alt from 'alt-server';
import ChatManager from '../systems/chat';
import { getPlayersByPermissionLevel } from '../utility/filters';
import { Permissions } from '../../shared/flags/permissions';
import { emitAll } from '../utility/emit-helper';
import { View_Events_Chat } from '../../shared/enums/views';
import { playerFuncs } from '../extensions/Player';
import { LocaleManager } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatManager.addCommand(
    'broadcast',
    LocaleManager.get(LOCALE_KEYS.COMMAND_BROADCAST, '/broadcast'),
    Permissions.Admin,
    handleBroadcast
);
ChatManager.addCommand(
    'ac',
    LocaleManager.get(LOCALE_KEYS.COMMAND_ADMIN_CHAT, '/ac'),
    Permissions.Admin,
    handleAdminChat
);

ChatManager.addCommand(
    'mc',
    LocaleManager.get(LOCALE_KEYS.COMMAND_MOD_CHAT, '/mc'),
    Permissions.Moderator | Permissions.Admin,
    handleModeratorChat
);

function handleAdminChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatManager.getDescription('ac'));
        return;
    }

    const admins = getPlayersByPermissionLevel([Permissions.Admin]);
    emitAll(admins, View_Events_Chat.Append, `[AC] ${player.data.name}: ${args.join(' ')}`);
}

function handleModeratorChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatManager.getDescription('mc'));
        return;
    }

    const modsAndAdmins = getPlayersByPermissionLevel([Permissions.Admin, Permissions.Moderator]);
    emitAll(modsAndAdmins, View_Events_Chat.Append, `[MC] ${player.data.name}: ${args.join(' ')}`);
}

function handleBroadcast(player: alt.Player, ...args) {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatManager.getDescription('broadcast'));
        return;
    }

    emitAll(
        alt.Player.all,
        View_Events_Chat.Append,
        `[${LocaleManager.get(LOCALE_KEYS.COMMAND_BROADCAST)}] ${player.data.name}: ${args.join(' ')}`
    );
}
