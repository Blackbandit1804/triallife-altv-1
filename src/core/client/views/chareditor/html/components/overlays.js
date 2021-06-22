const OverlaysComponent = Vue.component('overlays', {
    props: ['data', 'locales'],
    methods: {
        handleChange(value, parameter, index) {
            this.data.opacityOverlays[index][parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        getOverlayColorCount() {
            return overlayColors.length - 1;
        },
        decrementParameter(index, min, max, incrementValue) {
            const currentValues = [...this.data.opacityOverlays];
            currentValues[index].value -= incrementValue;
            if (currentValues[index].value < min) currentValues[index].value = max;
            this.data.opacityOverlays = currentValues;
            this.$root.$emit('updateCharacter');
        },
        incrementParameter(index, min, max, incrementValue) {
            const currentValues = [...this.data.opacityOverlays];
            currentValues[index].value += incrementValue;
            if (currentValues[index].value > max) currentValues[index].value = min;
            this.data.opacityOverlays = currentValues;
            this.$root.$emit('updateCharacter');
        },
        toggleModule(moduleName) {
            this.modules[moduleName] = !this.modules[moduleName];
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        getLocale(id) {
            return this.locales.overlaysComponent.ids[id] ? this.locales.overlaysComponent.ids[id] : `COULD NOT FIND LOCALE FOR overlaysComponent.${id}`;
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                <template v-for="(option, i) in OverlaysList" :key="i">
                    <template v-if="i !== 0"><br/></template>
                    <div class="overline grey--text">{{ getLocale(option.id).name }}</div>
                    <div class="button-group pa-2">
                        <div class="overline grey--text">{{ locales.overlaysComponent.LABEL_STYLE }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter(i, option.min, option.max, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="green--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ getLocale(option.id).labels ? getLocale(option.id).labels[data.opacityOverlays[i].value] : data.opacityOverlays[i].value }}
                            </span>
                            <button @click="incrementParameter(i, option.min, option.max, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="green--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="green--text mr-3" label outlined>{{ data.opacityOverlays[i].value }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" :min="option.min" :max="option.max" step="1" v-model.number="data.opacityOverlays[i].value" @input="e => handleChange(e, 'value', i)"/>
                        </div>
                        <div class="overline green--text">{{ locales.overlaysComponent.LABEL_OPACITY }}</div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="green--text mr-3" label outlined>{{ data.opacityOverlays[i].opacity }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" :min="0" :max="1" step="0.1" v-model.number="data.opacityOverlays[i].opacity" @input="e => handleChange(e, 'opacity', i)"/>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    `
});
