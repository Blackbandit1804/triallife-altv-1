Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            pluginAddress: '127.0.0.1:38088',
            isConnected: false,
            serverUniqueIdentifier: null,
            isErrored: false,
            ts3ip: '',
            show: false
        };
    },
    methods: {
        connect() {
            try {
                window.webSocket = new window.WebSocket(`ws://${this.pluginAddress}/`);
                window.webSocket.onmessage = function (evt) {
                    console.log(`Salty Chat Message: ${evt.data}`);
                    let object = JSON.parse(evt.data);
                    if (!('alt' in window)) return;
                    if (typeof this.serverUniqueIdentifier === 'string') {
                        if (object.ServerUniqueIdentifier === this.serverUniqueIdentifier) alt.emit('onMessage', evt.data);
                        else if (typeof object.ServerUniqueIdentifier === 'undefined') alt.emit('onError', evt.data);
                    } else {
                        if (typeof object.ServerUniqueIdentifier === 'string') alt.emit('onMessage', evt.data);
                        else alt.emit('onError', evt.data);
                    }
                };
                window.webSocket.onopen = function () {
                    this.isConnected = true;
                    if (!('alt' in window)) return;
                    alt.emit('onConnected');
                };
                window.webSocket.onclose = function () {
                    this.isConnected = false;
                    setTimeout(this.connect, 500);
                    if (!('alt' in window)) return;
                    alt.emit('onDisconnected');
                };
            } catch (err) {
                return;
            }
        },
        runCommand(command) {
            if (!this.isConnected || typeof command !== 'string') return;
            window.webSocket.send(command);
        },
        nui(state, ts3ip = null) {
            this.ts3ip = ts3ip;
            this.show = state;
        }
    },
    mounted() {
        this.connect();
        if (!('alt' in window)) {
            this.nui(true, 'gremmler86.zap-ts3.com');
            return;
        }
        alt.on('runCommand', this.runCommand);
        alt.on('showOverlay', this.nui);
    }
});
