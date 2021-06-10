Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            token: '',
            info: 'Außerhalb ihres Spiels öffnet sich eine Seite, die dich beim Einloggen unterstützt'
        };
    },
    methods: {
        ready() {
            this.token = token;
        },
        login() {}
    },
    mounted() {}
});
