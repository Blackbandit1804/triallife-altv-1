Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            pluginAddress: '127.0.0.1:38088',
            isConnected: false,
            serverUniqueIdentifierFilter: null,
            packetsSent: 0,
            packetsReceived: 0,
            lastCommand: '',
            isErrored: false,
            info: ''
        };
    },
    methods: {
        connect() {
            try {
                window.WebSocket = new window.WebSocket(`ws://${pluginAddress}/`);
                webSocket.onerror = function (err) {
                    isErrored = true;
                    console.error('Teamspeak not running or wrong Plugin Version');
                };
                webSocket.onmessage = function (evt) {
                    let object = JSON.parse(evt.data);
                    if (!('alt' in window)) return;
                    if (typeof serverUniqueIdentifierFilter === 'string') {
                        if (object.ServerUniqueIdentifier === serverUniqueIdentifierFilter) alt.emit('SaltyChat_OnMessage', evt.data);
                        else if (typeof object.ServerUniqueIdentifier === 'undefined') alt.emit('SaltyChat_OnError', evt.data);
                    } else {
                        if (typeof object.ServerUniqueIdentifier === 'string') alt.emit('SaltyChat_OnMessage', evt.data);
                        else alt.emit('SaltyChat_OnError', evt.data);
                    }
                    packetsReceived++;
                    updateHtml();
                };
                webSocket.onopen = function () {
                    isConnected = true;
                    if ('alt' in window) alt.emit('SaltyChat_OnConnected');
                };
                webSocket.onclose = function () {
                    isConnected = false;
                    if ('alt' in window) alt.emit('SaltyChat_OnDisconnected');
                    if (!isErrored) connect();
                };
            } catch (err) {
                return;
            }
        },
        setWebSocketAddress(address) {
            if (typeof address === 'string') pluginAddress = address;
        },
        setServerUniqueIdentifierFilter(serverUniqueIdentifier) {
            if (typeof serverUniqueIdentifier === 'string') serverUniqueIdentifierFilter = serverUniqueIdentifier;
        },
        runCommand(command) {
            if (!isConnected || typeof command !== 'string') return;
            webSocket.send(command);
            packetsSent++;
            lastCommand = command;
            updateHtml();
        },
        updateHtml() {
            this.info = `Last Command: ${lastCommand}</br>Packets Sent: ${packetsSent}</br>Packets Received ${packetsReceived}`;
        }
    },
    mounted() {
        if ('alt' in window) alt.on('salty:runCommand', this.runCommand);
        this.connect();
        this.updateHtml();
    }
});
