Vue.config.devtools = true;
Vue.prototype.window = window;

const exampleCharacter = {
    _id: '5f7117a3fd8d0a66b02eb998',
    pos: { x: -734.5714111328125, y: -264.4747314453125, z: 37.03076171875 },
    cash: 25,
    bank: 50,
    rewardPoints: 0,
    info: {
        age: 18,
        gender: 'male'
    },
    name: 'Roman Jackson',
    appearance: {
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
    characterIndex: 0
};

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            characters: [],
            infos: [],
            characterIndex: 0,
            deleteDialog: false
        };
    },
    methods: {
        handleSet(characters, infos) {
            this.characterIndex = 0;
            this.characters = characters;
            this.infos = infos;
            this.updateAppearance();
        },
        incrementIndex() {
            this.characterIndex = Math.min(this.characters.length - 1, this.characterIndex + 1);
            this.updateAppearance();
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            this.characterIndex = Math.max(0, this.characterIndex - 1);
            this.updateAppearance();
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updateAppearance() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:Update', this.characters[this.characterIndex].appearance);

            setTimeout(() => {
                alt.emit('characters:Equipment', this.characters[this.characterIndex].equipment);
            }, 500);
        },
        selectCharacter() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('characters:Select', this.characters[this.characterIndex]._id);
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
            alt.emit('characters:Delete', this.characters[this.characterIndex]._id);
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('characters:Set', this.handleSet);
            alt.emit('characters:Ready');
            alt.emit('ready');
        } else {
            this.infos = [
                {
                    title: 'Trial Life v1 Early Alpha',
                    message: 'Diese Version wird Fehler enthalten<br/>Bitte meldet dem Team die Bugs<br/>Wir wünschen euch viel Spaß<br/><br/>Euer TL:RP - Team'
                }
            ];
            this.characters = [exampleCharacter, { ...exampleCharacter, ...{ appearance: { sex: 0 }, name: 'Jobi_Jobonai' } }];
        }
    }
});
