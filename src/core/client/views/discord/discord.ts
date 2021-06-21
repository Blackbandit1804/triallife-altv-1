import * as alt from 'alt-client';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/discord/html/index.html`;
let view: View;
let discordURI;

export class DiscordManager {
    static async show(oAuthUrl: string) {
        discordURI = oAuthUrl;
        view = await View.getInstance(url, true, false, false);
        view.on('discord:OpenURL', DiscordManager.open);
        view.on('discord:FinishAuth', DiscordManager.finish);
        alt.toggleGameControls(false);
    }

    static open() {
        if (!view) return;
        view.emit('discord:OpenURL', discordURI, true);
    }

    static close() {
        alt.toggleGameControls(true);
        if (view) view.close();
    }

    static finish() {
        alt.emitServer('discord:FinishAuth');
    }

    static emitFailureMessage(message: string) {
        if (!view) return;
        view.emit('discord:Fail', message);
    }

    static trigger() {
        alt.emitServer('discord:Begin');
    }
}

alt.on('connectionComplete', DiscordManager.trigger);
alt.onServer(`Discord:Open`, DiscordManager.show);
alt.onServer(`Discord:Close`, DiscordManager.close);
alt.onServer('Discord:Fail', DiscordManager.emitFailureMessage);
