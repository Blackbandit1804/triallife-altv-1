import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatManager from '../systems/chat';

ChatManager.addCommand(
    'coords',
    LocaleManager.get(LOCALE_KEYS.COMMAND_COORDS, '/coords'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, x: string, y: string, z: string): void {
    try {
        playerFuncs.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
    } catch (err) {
        playerFuncs.emit.message(player, ChatManager.getDescription('coords'));
    }
}
