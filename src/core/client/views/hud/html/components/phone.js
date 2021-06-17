const phone = Vue.component('phone', {
    components: [appBank, appDealership, appVehicles],
    data() {
        return {
            isActive: true,
            page: 0,
            maxPages: 3,
            pageComponent: null, // 'app-bank'
            data: {
                hour: 1,
                minute: 0,
                bank: 0,
                cash: 0,
                vehicles: []
            }
        };
    },
    methods: {
        navigatePage(pageNumber) {
            this.page = pageNumber;
        },
        selectApp(e) {
            const appComponent = e.target.id;

            if (!appComponent) {
                return;
            }

            this.pageComponent = appComponent;
        },
        setData(fieldName, fieldValue) {
            const data = { ...this.data };
            data[fieldName] = fieldValue;
            this.data = data;
        },
        toggle() {
            this.isActive = !this.isActive ? true : false;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('mouse:Focus', this.isActive, 'isPhoneOpen');
        }
    },
    computed: {
        getTime() {
            let timeData = { hour: new String(this.data.hour).padStart(2, '0'), minute: new String(this.data.minute).padStart(2, '0') };
            return `${timeData.hour}:${timeData.minute}`;
        },
        getDate() {
            let date = new Date();
            let dateData = { day: new String(date.getDate()).padStart(2, '0'), month: new String(date.getMonth() + 1).padStart(2, '0'), year: date.getFullYear() };
            return `${dateData.day}.${dateData.month}.${dateData.year}`;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('phone:SetData', this.setData);
            alt.on('phone:Toggle', this.toggle);

            setTimeout(() => {
                alt.emit('phone:ATM:Populate');
            }, 5000);
        } else {
            this.data.vehicles = [
                {
                    fuel: 100,
                    model: 'rocoto',
                    uid: 'a68888e32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1f34462c'
                },
                {
                    fuel: 50,
                    model: 'infernus',
                    uid: 'a6c32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 25,
                    model: 'akuma',
                    uid: 'a6ff332a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 100,
                    model: 'washington',
                    uid: 'a68888e32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1f34462c'
                },
                {
                    fuel: 50,
                    model: 'buffalo',
                    uid: 'a6c32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 25,
                    model: 'gauntlet',
                    uid: 'a6ff332a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                }
            ];

            this.data.bank = 25000;
            this.data.cash = 500;

            setTimeout(() => {
                //this.toggle();
            }, 500);
        }
    },
    beforeDestroy() {
        if (!('alt' in window)) {
            return;
        }

        alt.off('phone:SetData', this.setData);
        alt.off('phone:Toggle', this.toggle);
    },
    template: `
        <div class="phoneWrapper">
            <div class="iphone-x" v-if="!isActive">
                <div class="notch">
                    <div class="white--text overline pt-1">{{ getDate }}</div>
                    <div class="white--text overline pt-1">{{ getTime }}</div>
                </div>
            </div>
            <div class="iphone-x iphone-x-active" v-if="isActive">
                <div class="notch">
                    <div class="white--text overline pt-1">{{ getDate }}</div>
                    <div class="white--text overline pt-1">{{ getTime }}</div>
                </div>
                <div class="screen">
                    <div class="main">
                        <template v-if="!pageComponent">
                                <div class="home" v-if="page === 0">
                                    <div class="phone-icon green darken-2" id="app-phone" @click="selectApp">
                                        <div class="text-icon font-weight-black">Phone</div>
                                        <v-icon x-large>icon-phone</v-icon>
                                    </div>
                                    <div class="phone-icon blue lighten-2" id="app-messaging" @click="selectApp">
                                        <div class="text-icon font-weight-black">Messages</div>
                                        <v-icon x-large>icon-message</v-icon>
                                    </div>
                                    <div class="phone-icon orange" id="app-vehicles" @click="selectApp">
                                        <div class="text-icon font-weight-black">Contacts</div>
                                        <v-icon x-large>icon-address-book</v-icon>
                                    </div>
                                    <div class="phone-icon red darken-1" id="app-bank" @click="selectApp">
                                        <div class="text-icon font-weight-black">Bank</div>
                                        <v-icon x-large>icon-bank</v-icon>
                                    </div>
                                    <div class="phone-icon orange darken-4" id="app-dealership" @click="selectApp">
                                        <div class="text-icon font-weight-black">Dealership</div>
                                        <v-icon x-large>icon-automobile</v-icon>
                                    </div>
                                    <!--
                                    <div class="phone-icon" id="app-homes">
                                        <div class="text-icon font-weight-black">Home</div>
                                        <v-icon x-large>icon-home</v-icon>
                                    </div>
                                    -->
                                </div>
                                <div class="home" v-if="page === 1">
                                    <div class="phone-icon">
                                        <div class="text-icon font-weight-black">Settings</div>
                                        <v-icon x-large>icon-settings</v-icon>
                                    </div>
                                </div>
                                <div class="home" v-if="page === 2">
                                    <!-- Maybe your app can go here ;) -->
                                </div>

                                <div class="phone-dots">
                                    <div class="phone-dot" v-for="(value, index) in maxPages" :key="index">
                                        <div v-if="page === index">
                                            <v-icon @click="navigatePage(index)" x-small>icon-circle1</v-icon>
                                        </div>
                                        <div class="inactive" v-else>
                                            <v-icon @click="navigatePage(index)" x-small>icon-circle</v-icon>
                                        </div>
                                    </div>
                                </div>
                        </template>
                        <template v-else>
                            <component v-bind:is="pageComponent" v-bind:data="data" />
                        </template>
                    </div>
                    <div class="bottom-bar">
                        <button class="flex-grow-1 clickable" @click="pageComponent = null">
                            <v-icon small>icon-chevron-left</v-icon>
                        </button>
                        <button class="flex-grow-1 clickable" @click="pageComponent = null; page = 0;">
                            <v-icon x-small>icon-square-o</v-icon>
                        </button>
                        <button class="flex-grow-1" disabled style="opacity: 0; !improtant">
                            <v-icon class="transparent" style="opacity: 0;">icon-circle</v-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
});
