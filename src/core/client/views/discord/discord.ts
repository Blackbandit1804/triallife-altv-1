import * as alt from 'alt-client';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/login/html/index.html`;
let view: View;
let discordURI;

export class LoginController {
    static async show(oAuthUrl: string) {
        discordURI = oAuthUrl;
        view = await View.getInstance(url, true, false, false);
        view.on('discord:OpenURL', LoginController.open);
        view.on('discord:FinishAuth', LoginController.finish);
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
        alt.emitServer('discord:FinishAuth', alt.Discord.currentUser);
    }

    static emitFailureMessage(message: string) {
        if (!view) return;
        view.emit('discord:Fail', message);
    }

    static trigger() {
        alt.emitServer('discord:Begin');
    }
}

alt.on('connectionComplete', LoginController.trigger);
alt.onServer(`Discord:Open`, LoginController.show);
alt.onServer(`Discord:Close`, LoginController.close);
alt.onServer('Discord:Fail', LoginController.emitFailureMessage);
