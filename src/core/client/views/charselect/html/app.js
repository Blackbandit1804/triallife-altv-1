Vue.config.devtools = true;
Vue.prototype.window = window;

const exampleCharacter = {
    _id: '5f7117a3fd8d0a66b02eb998',
    pos: { x: -734.5714111328125, y: -264.4747314453125, z: 37.03076171875 },
    info: {
        name: 'Kurt Krabowski',
        age: 18,
        gender: 'male'
    },
    design: {
        colorOverlays: [0, 0, 0],
        eyebrows: 0,
        eyes: 3,
        eyebrowsColor1: 4,
        eyebrowsOpacity: 1,
        faceMix: 0.5,
        facialHairOpacity: 1,
        faceFather: 44,
        faceMother: 38,
        facialHair: 29,
        facialHairColor1: 0,
        hair: 68,
        hairColor1: 5,
        hairColor2: 8,
        hairOverlay: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M' },
        structure: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        opacityOverlays: [0, 0, 0, 0, 0, 0],
        sex: 1,
        skinFather: 16,
        skinMix: 0.1,
        skinMother: 23
    },
    account_id: '5f70bb5e829f5c3e80aa4192',
    position: { x: -740.6505737304688, y: -254.8219757080078, z: 37.03076171875 },
    slot: 0
};

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            characters: [],
            infos: [],
            slot: 0,
            deleteDialog: false
        };
    },
    computed: {
        hasCharacters() {
            return this.characters.length >= 2;
        }
    },
    methods: {
        setData(characters, infos) {
            this.slot = 0;
            this.characters = characters;
            this.infos = infos;
            this.updateDesign();
        },
        incrementIndex() {
            this.slot = Math.min(this.characters.length - 1, this.slot + 1);
            this.updateDesign();
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            this.slot = Math.max(0, this.slot - 1);
            this.updateDesign();
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updateDesign() {
            if (!('alt' in window)) return;
            alt.emit('charselect:Update', this.characters[this.slot].design);
            setTimeout(() => alt.emit('charselect:Equipment', this.characters[this.slot].equipment), 500);
        },
        selectCharacter() {
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('charselect:Select', this.characters[this.slot]._id);
        },
        createCharacter() {
            if (!('alt' in window)) return;
            alt.emit('charselect:Create');
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        showDeleteInterface() {
            this.deleteDialog = true;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        hideDeleteInterface() {
            this.deleteDialog = false;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        deleteCharacter() {
            this.deleteDialog = false;
            if (!('alt' in window)) return;
            alt.emit('characters:Delete', this.characters[this.slot]._id);
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('charselect:SetData', this.setData);
            alt.emit('ready');
        } else this.setData([exampleCharacter, { ...exampleCharacter, ...{ design: { sex: 0 }, ...{ info: { name: 'Gina Banks', gender: 'female' } } } }], []);
    }
});
