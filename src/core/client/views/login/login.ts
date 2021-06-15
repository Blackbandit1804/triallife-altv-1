import * as alt from 'alt-client';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleManager } from '../../../shared/locale/locale';
import { View } from '../../extensions/view';

// const url = `http://127.0.0.1:5555/src/core/client/views/login/html/index.html`;
const url = `http://resource/client/views/login/html/index.html`;
let view: View;
let discordURI;

export class LoginManager {
    static async show(oAuthUrl: string) {
        discordURI = oAuthUrl;
        view = await View.getInstance(url, true, false, false);
        view.on('discord:OpenURL', LoginManager.open);
        view.on('discord:FinishAuth', LoginManager.finish);
        view.on('discord:Ready', LoginManager.handleReady);
        alt.toggleGameControls(false);
    }

    static handleReady() {
        if (!view) {
            return;
        }

        view.emit('discord:SetLocales', LocaleManager.getWebviewLocale(LOCALE_KEYS.WEBVIEW_LOGIN));
    }

    static open() {
        if (!view) {
            return;
        }

        view.emit('discord:OpenURL', discordURI, true);
    }

    static close() {
        alt.toggleGameControls(true);

        if (view) {
            view.close();
        }
    }

    static finish() {
        alt.emitServer('discord:FinishAuth');
    }

    static emitFailureMessage(message: string) {
        if (!view) {
            return;
        }

        view.emit('discord:Fail', message);
    }

    static trigger() {
        alt.emitServer('discord:Begin');
    }
}

alt.on('connectionComplete', LoginManager.trigger);
alt.onServer(`Discord:Open`, LoginManager.show);
alt.onServer(`Discord:Close`, LoginManager.close);
alt.onServer('Discord:Fail', LoginManager.emitFailureMessage);
