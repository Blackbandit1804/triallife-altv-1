import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/player';
import ChatManager from '../systems/chat';

ChatManager.addCommand('acceptdeath', LocaleManager.get(LOCALE_KEYS.COMMAND_ACCEPT_DEATH, '/acceptdeath'), Permissions.None, handleCommand);

ChatManager.addCommand('respawn', LocaleManager.get(LOCALE_KEYS.COMMAND_ACCEPT_DEATH, '/respawn'), Permissions.None, handleCommand);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid) {
        return;
    }

    if (!player.data.isDead) {
        return;
    }

    if (Date.now() < player.nextDeathSpawn) {
        return;
    }

    playerFuncs.set.respawned(player, null);
}
