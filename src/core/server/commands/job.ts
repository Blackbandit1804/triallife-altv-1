import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/player';
import ChatManager from '../systems/chat';
import { getPlayerJob } from '../systems/job';

ChatManager.addCommand('quitjob', LocaleManager.get(LOCALE_KEYS.COMMAND_QUIT_JOB, '/quitjob'), Permissions.None, handleCommand);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid) {
        return;
    }

    const job = getPlayerJob(player);

    if (!job) {
        playerFuncs.emit.notification(player, LocaleManager.get(LOCALE_KEYS.JOB_NOT_WORKING));
        return;
    }

    job.quit(LocaleManager.get(LOCALE_KEYS.JOB_QUIT));
}
