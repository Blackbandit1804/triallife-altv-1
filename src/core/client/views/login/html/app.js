Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data() {
        return {
            url: null,
            loading: false,
            done: false,
            updates: 0,
            waitingForAuth: false,
            errorMessage: null,
            readyToFinish: false,
            locales: {
                LABEL_OPEN_PAGE: `Außerhalb Ihres Spiels öffnet sich eine Seite, die Sie beim Einloggen unterstützt`,
                LABEL_LOGIN_WITH_DISCORD: `Mit Discord anmelden `,
                LABEL_TAB_OUT: `Überprüfen Sie Ihren Browser, um die Authentifizierung abzuschließen. Wenn dies fehlschlägt, versuchen Sie, das
                Fenster wieder zu öffnen`,
                LABEL_FINISH_LOGIN: `Anmeldung beenden `,
                LABEL_OPEN_WINDOW: `Anmeldefenster erneut öffnen`
            }
        };
    },
    methods: {
        setLocales(locales) {
            this.locales = locales;
        },
        setAsReady() {
            this.$nextTick(() => {
                this.updates += 1;
                if ('alt' in window) {
                    alt.emit('ready');
                    alt.emit('discord:Ready');
                }
            });
        },
        beginAuth() {
            setTimeout(() => {
                this.getURL();
                this.errorMessage = null;
                this.updates += 1;
            }, 100);

            setTimeout(() => {
                this.readyToFinish = true;
                this.updates += 1;
            }, 3000);
        },
        finishAuth() {
            this.loading = true;
            this.updates += 1;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('discord:FinishAuth');
        },
        authAgain() {
            this.getURL();
        },
        getURL() {
            this.waitingForAuth = true;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('discord:OpenURL');
        },
        hover() {
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        openURL(url) {
            this.window = window.open(url);
        },
        finishedLoading() {
            this.$nextTick(() => this.setAsReady());
        },
        endWindow() {
            if (!this.window) return;
            try {
                this.window.close();
            } catch (err) {
                console.log(err);
            }
        },
        fail(message) {
            this.errorMessage = message;
            this.waitingForAuth = false;
            this.loading = false;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('discord:SetLocales', this.setLocales);
            alt.on('discord:OpenURL', this.openURL);
            alt.on('discord:endWindow', this.endWindow);
            alt.on('discord:Fail', this.fail);
        }
        this.finishedLoading();
    }
});
