Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data() {
        return {
            info: `Sie haben die Seite direkt besucht. Zum Repository: https://github.com/DeathNeroTV/triallife-altv/`,
            success: false
        };
    },
    methods: {
        loadTlrp() {
            window.open(`https://github.com/DeathNeroTV/triallife-altv/`);
        }
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        this.success = urlParams.get('success') === 'true' ? true : false;
        this.info = urlParams.get('info');
        window.history.replaceState(null, null, window.location.pathname);
    }
});
