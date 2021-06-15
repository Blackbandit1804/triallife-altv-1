import * as alt from 'alt-server';
import ChatManager from '../systems/chat';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/player';
import { AudioStream } from '../../shared/interfaces/audio';
import { LocaleManager } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatManager.addCommand('audiostream', LocaleManager.get(LOCALE_KEYS.COMMAND_AUDIOSTREAM, '/audiostream'), Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player, identifier: string): void {
    if (!identifier) {
        playerFuncs.emit.message(player, ChatManager.getDescription('audiostream'));
        return;
    }

    const stream: AudioStream = {
        position: player.pos,
        streamName: identifier,
        duration: 217000 // This is in milliseconds btw.
    };

    playerFuncs.emit.audioStream(stream);
}
