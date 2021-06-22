const status = Vue.component('status', {
    data() {
        return {
            // On Foot
            food: 100,
            water: 100,
            mood: 100,
            blood: 7500,
            voice: 32,
            // Vehicle
            fuel: 100,
            speed: '0 MP/H',
            inVehicle: false,
            seatbelt: false,
            engineState: false,
            interact: false,
            lights: false,
            lockState: 1,
            lockIcons: ['n/a', 'mdi-lock-open', 'mdi-lock', 'n/a', 'mdi-block-helper'],
            lockColor: ['grey', 'green', 'red', 'grey', 'orange'],
            engineColor: { false: 'grey', true: 'blue' },
            seatbeltColor: { false: 'grey', true: 'blue' },
            interactColor: { false: 'grey', true: 'blue' },
            lightsColor: { false: 'grey', true: 'blue' },
            objective: null
        };
    },
    methods: {
        setWater(value) {
            this.water = value;
        },
        setFood(value) {
            this.food = value;
        },
        setMood(value) {
            this.mood = value;
        },
        setBlood(value) {
            this.blood = value;
        },
        setVoice(value) {
            this.voice = value;
        },
        setFuel(value) {
            this.fuel = value;
        },
        setLock(value) {
            this.lockState = value;
        },
        setSpeed(value) {
            this.speed = value;
        },
        setVehicle(value) {
            this.inVehicle = value;
            if (!value) this.seatbelt = false;
        },
        setLock(value) {
            this.lockState = value;
        },
        setEngine(value) {
            this.engineState = value;
        },
        setSeatbelt(value) {
            this.seatbelt = value;
        },
        setInteract(value) {
            this.interact = value;
        },
        setLights(value) {
            this.lights = value;
        },
        setObjective(value) {
            this.objective = value;
        },
        getTotalHeight(name) {
            const percent = name === 'blood' ? (this[name] / 7500) * 100 : name === 'voice' ? (this[name] / 32.0) * 100 : this[name];
            return `height: ${percent}% !important;`;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('hud:SetFood', this.setFood);
            alt.on('hud:SetWater', this.setWater);
            alt.on('hud:SetMood', this.setMood);
            alt.on('hud:SetBlood', this.setBlood);
            alt.on('hud:SetVoice', this.setVoice);
            alt.on('hud:SetFuel', this.setFuel);
            alt.on('hud:SetVehicle', this.setVehicle);
            alt.on('hud:Speed', this.setSpeed);
            alt.on('hud:SetLock', this.setLock);
            alt.on('hud:SetEngine', this.setEngine);
            alt.on('hud:Seatbelt', this.setSeatbelt);
            alt.on('hud:SetInteract', this.setInteract);
            alt.on('hud:SetLights', this.setLights);
            alt.on('hud:SetObjective', this.setObjective);
        } else this.objective = 'hello this is an objective text';
    },
    beforeDestroy() {
        if (!('alt' in window)) return;
        alt.off('hud:SetFood', this.setFood);
        alt.off('hud:SetWater', this.setWater);
        alt.off('hud:SetFuel', this.setFuel);
        alt.off('hud:SetVehicle', this.setVehicle);
        alt.off('hud:Speed', this.setSpeed);
        alt.off('hud:SetLock', this.setLock);
        alt.off('hud:SetEngine', this.setEngine);
        alt.off('hud:Seatbelt', this.setSeatbelt);
        alt.off('hud:SetInteract', this.setInteract);
        alt.off('hud:SetLights', this.setLights);
        alt.off('hud:SetObjective', this.setObjective);
    },
    template: `<div>
        <div class="objective" v-if="objective">{{ objective }}</div>
        <div class="status-player pa-1">
            <div class="food squared">
                <v-icon class="icon">mdi-hamburger</v-icon>
                <div class="status-overlay green darken-2" :style="getTotalHeight('food')"></div>
            </div>
            <div class="water squared">
                <v-icon class="icon">mdi-water</v-icon>
                <div class="status-overlay green darken-2" :style="getTotalHeight('water')"></div>
            </div>
            <div class="mood squared">
                <v-icon class="icon">mdi-sleep</v-icon>
                <div class="status-overlay green darken-2" :style="getTotalHeight('mood')"></div>
            </div>
            <div class="blood squared">
                <v-icon class="icon">mdi-blood-bag</v-icon>
                <div class="status-overlay green darken-2" :style="getTotalHeight('blood')"></div>
            </div>
            <div class="voice squared">
                <v-icon class="icon">mdi-microphone</v-icon>
                <div class="status-overlay green darken-2" :style="getTotalHeight('voice')"></div>
            </div>
        </div>
        <div class="status-vehicle pa-1" v-if="inVehicle">
            <div class="fuel squared">
                <v-icon class="icon">mdi-gas-station</v-icon>
                <div class="status-overlay green" :style="getTotalHeight('fuel')"></div>
            </div>
            <div class="fuel squared">
                <v-icon class="icon">{{ lockIcons[lockState] }}</v-icon>
                <div class="status-overlay" :class="lockColor[lockState]"></div>
            </div>
            <div class="engine squared">
                <v-icon class="icon">mdi-engine</v-icon>
                <div class="status-overlay" :class="engineColor[engineState]" :style="getTotalHeight('lock')"></div>
            </div>
            <div class="seatbelt squared">
                <v-icon class="icon">mdi-seatbelt</v-icon>
                <div class="status-overlay" :class="seatbeltColor[seatbelt]" :style="getTotalHeight('lock')"></div>
            </div>
            <div class="headlight squared">
                <v-icon class="icon">mdi-car-light-high</v-icon>
                <div class="status-overlay" :class="lightsColor[lights]" :style="getTotalHeight('lock')"></div>
            </div>
            <div class="speed">{{ speed }}</div>
        </div>
    </div>`
});
