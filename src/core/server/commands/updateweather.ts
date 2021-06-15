import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/player';
import ChatManager from '../systems/chat';

ChatManager.addCommand('updateweather', LocaleManager.get(LOCALE_KEYS.COMMAND_UPDATE_WEATHER, '/setweater'), Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player): void {
    playerFuncs.sync.weather(player);
}
