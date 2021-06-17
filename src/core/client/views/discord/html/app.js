Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            url: null,
            loading: false,
            done: false,
            updates: 0,
            waitingForAuth: false,
            errorMessage: null,
            readyToFinish: false
        };
    },
    methods: {
        setAsReady() {
            this.$nextTick(() => (this.updates += 1));
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
            if ('alt' in window) alt.emit('discord:FinishAuth');
            else setTimeout(() => this.fail('Testing fail message'), 2000);
        },
        authAgain() {
            this.getURL();
        },
        getURL() {
            this.waitingForAuth = true;
            if (!('alt' in window)) return;
            alt.emit('discord:OpenURL');
        },
        hover() {
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        openURL(url) {
            if (!this.window) return;
            try {
                this.window.close();
            } catch (err) {
                console.log(err);
            }
            this.window = window.open(url);
        },
        loadTlrp() {
            window.open(`https://github.com/DeathNeroTV/triallife-altv`);
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
            alt.on('discord:OpenURL', this.openURL);
            alt.on('discord:endWindow', this.endWindow);
            alt.on('discord:Fail', this.fail);
        }
        this.finishedLoading();
    }
});
