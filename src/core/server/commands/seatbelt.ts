import * as alt from 'alt-server';
import { Vehicle_Events } from '../../shared/enums/vehicle';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatManager from '../systems/chat';

ChatManager.addCommand(
    'seatbelt',
    LocaleManager.get(LOCALE_KEYS.COMMAND_SEATBELT, '/seatbelt'),
    Permissions.None,
    handleCommand
);

ChatManager.addCommand('sb', LocaleManager.get(LOCALE_KEYS.COMMAND_SEATBELT, '/sb'), Permissions.None, handleCommand);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    if (player.data.isDead) {
        return;
    }

    playerFuncs.emit.sound2D(player, 'seatbelt_on', 0.75);
    playerFuncs.emit.notification(player, LocaleManager.get(LOCALE_KEYS.PLAYER_SEATBELT_ON));
    alt.emitClient(player, Vehicle_Events.SET_SEATBELT);
}
