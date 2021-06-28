Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            x: 0,
            y: 0,
            itemInfo: null,
            dragAndDrop: { shiftX: null, shiftY: null, clonedElement: null, itemIndex: null, selectedElement: null },
            inventory: { maxWeight: 0.0, items: [], money: 0.0 },
            ground: [],
            equipment: [],
            toolbar: [],
            disablePreview: false,
            split: null,
            splitAmount: 1,
            locales: {
                ITEM_SLOTS: ['Hut', 'Maske', 'Oberteil', 'Hose', 'Schuhe', 'Brille', 'Ohren', 'Tasche', 'Panzerung', 'Uhr', 'Kettchen'],
                LABEL_SPLIT: 'Teilen',
                LABEL_CANCEL: 'Abbrechen'
            }
        };
    },
    methods: {
        updateInventory(inventoryItems) {
            const items = new Array(parseInt(this.inventory.maxWeight.toFixed(0))).fill(null);
            for (let i = 0; i < inventoryItems.length; i++) {
                if (!inventoryItems[i]) continue;
                const slot = inventoryItems[i].slot;
                items[slot] = inventoryItems[i];
            }
            this.inventory.items = items;
        },
        updateGround(groundItems) {
            const newGround = new Array(8).fill(null);
            if (groundItems.length <= 0) {
                this.ground = newGround;
                return;
            }
            groundItems.forEach((groundItem, index) => {
                if (index >= newGround.length) return;
                if (!groundItem) return;
                newGround[index] = groundItem.item;
            });
            this.ground = newGround;
        },
        updateEquipment(equipmentItems) {
            const newEquipment = new Array(11).fill(null);
            equipmentItems.forEach((item) => {
                if (!item) return;
                newEquipment[item.slot] = item;
            });
            this.equipment = newEquipment;
        },
        updateToolbar(toolbarItems) {
            const newToolbar = new Array(5).fill(null);
            toolbarItems.forEach((item) => {
                if (!item) return;
                newToolbar[item.slot] = item;
            });
            this.toolbar = newToolbar;
        },
        getInventoryClass() {
            const classList = {};
            if (this.ground.length <= 0) classList['expand-list'] = true;
            return classList;
        },
        selectItemInfo(e) {
            if (this.dragging) return;
            if (!e || !e.target || !e.target.id) return;
            this.itemInfo = e.target.id;
        },
        setItemInfo() {
            this.itemInfo = null;
        },
        cancelSplitStack() {
            this.split = null;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        splitStack(amount) {
            if (!amount) {
                this.split = null;
                return;
            }
            if (isNaN(amount)) return;
            if (amount == 0) return;
            if (amount > this.split.item.quantity) return;
            this.splitAmount = 1;
            this.split = null;
            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('inventory:Split', this.split.slot, this.splitAmount);
        },
        selectItem(e, index) {
            if (this.dragging) return;

            if (e.button === 2) {
                if (!e.target.id || e.target.id === '') return;
                if (e.shiftKey) {
                    const actualSlot = this.stripCategory(e.target.id);
                    let element;
                    if (e.target.id.includes('i-')) element = this.inventory.items.find((i) => i && i.slot === actualSlot);
                    else {
                        if (e.target.id.includes('e-')) element = this.equipment.find((i) => i && i.slot === actualSlot);
                        if (e.target.id.includes('t-')) element = this.toolbar.find((i) => i && i.slot === actualSlot);
                    }
                    if (!element) return;
                    if (!element.quantity || element.quantity <= 1) return;
                    if (!this.isFlagEnabled(element.behavior, 2)) return;
                    this.split = { slot: e.target.id, item: element };
                    this.splitAmount = Math.floor(element.quantity / 2);
                    return;
                }
                if (!('alt' in window)) return;
                alt.emit('play:Sound', 'YES', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                if (e.target.id.includes('g-')) {
                    alt.emit('inventory:Pickup', e.target.dataset.hash);
                    return;
                }
                alt.emit('inventory:Use', e.target.id);
                return;
            }

            this.dragging = true;

            const element = document.getElementById(e.target.id);

            if (!element) {
                this.dragging = false;
                return;
            }

            this.dragAndDrop.shiftX = e.clientX - element.getBoundingClientRect().left;
            this.dragAndDrop.shiftY = e.clientY - element.getBoundingClientRect().top;
            this.dragAndDrop.selectedElement = { style: element.style, classList: element.classList.toString() };
            this.dragAndDrop.itemIndex = e.target.id;

            const clonedElement = element.cloneNode(true);
            clonedElement.id = `cloned-${element.id}`;
            document.body.append(clonedElement);
            this.clonedElement = document.getElementById(`cloned-${element.id}`);
            this.clonedElement.classList.add('item-clone');
            this.clonedElement.classList.add('no-animation');
            this.clonedElement.style.left = `${e.clientX - this.dragAndDrop.shiftX}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;

            element.style.pointerEvents = 'none';
            element.style.setProperty('border', '2px dashed #2d2d2d', 'important');
            element.style.setProperty('opacity', '0.2', 'important');
            element.classList.add('grey', 'darken-4');
            element.classList.remove('grey', 'darken-3');

            document.addEventListener('mouseup', this.dropItem);
            document.addEventListener('mouseover', this.mouseOver);
            document.addEventListener('mousemove', this.updatePosition);

            if (!('alt' in window)) return;
            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updatePosition(e) {
            this.clonedElement.style.left = `${e.clientX - this.dragAndDrop.shiftX}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;
        },
        mouseOver(e) {
            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('border');
                this.lastHoverID = null;
            }
            if (!e || !e.target || !e.target.id || e.target.id === '') return;
            if (this.lastHoverID !== e.target.id) {
                const element = document.getElementById(e.target.id);
                element.style.setProperty('border', '2px dashed white', 'important');
                this.lastHoverID = e.target.id;
            }
        },
        async dropItem(e) {
            this.dragging = false;

            document.removeEventListener('mouseover', this.mouseOver);
            document.removeEventListener('mouseup', this.dropItem);
            document.removeEventListener('mousemove', this.updatePosition);

            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('border');
                element.style.removeProperty('box-shadow');
                this.lastHoverID = null;
            }

            this.clonedElement.remove();

            const selectElement = document.getElementById(this.dragAndDrop.itemIndex);
            selectElement.style = this.dragAndDrop.selectedElement.style;
            selectElement.style.pointerEvents = 'all';
            selectElement.classList.remove(...selectElement.classList);
            selectElement.classList.add(...this.dragAndDrop.selectedElement.classList.split(' '));

            this.x = 0;
            this.y = 0;

            if (!e || !e.target || !e.target.id || e.target.id === '') return;

            const selectedSlot = this.dragAndDrop.itemIndex;
            const endSlot = e.target.id;
            const endElement = document.getElementById(endSlot);

            const isGroundItem = this.dragAndDrop.itemIndex.includes('g-');
            const isNullEndSlot = endElement.classList.contains('is-null-item');
            const isInventoryEndSlot = !endElement.id.includes('i-');

            if (isGroundItem && !isNullEndSlot && !isInventoryEndSlot) return;

            if (selectedSlot === endSlot) return;

            const hash = selectElement.dataset.hash ? `${selectElement.dataset.hash}` : null;

            if ('alt' in window) alt.emit('inventory:Process', selectedSlot, endSlot, hash);

            await this.updateLocalData(selectedSlot, endSlot);
        },
        updateLocalData(selectedSlot, endSlot) {
            const selectIndex = this.stripCategory(selectedSlot);
            const endIndex = this.stripCategory(endSlot);
            const selectName = this.getDataName(selectedSlot);
            const endName = this.getDataName(endSlot);
            const selectItems = selectName === 'inventory' ? [...this[selectName].items] : [...this[selectName]];
            const endItems = endName === 'inventory' ? [...this[endName].items] : [...this[endName]];
            const selectItem = this.removeLocalItem(selectIndex, selectItems);
            const endItem = this.removeLocalItem(endIndex, endItems);
            if (endItem) endItem.slot = selectIndex;
            selectItem.slot = endIndex;
            this.replaceLocalData(endIndex, selectItem, endItems);
            this.replaceLocalData(selectIndex, endItem, selectItems);
            const selectFunctionUpdater = `update${this.capitalizeFirst(selectName)}`;
            const endFunctionUpdater = `update${this.capitalizeFirst(endName)}`;
            this[selectFunctionUpdater](selectItems);
            this[endFunctionUpdater](endItems);
        },
        capitalizeFirst(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        getDataName(prefix) {
            if (prefix.includes('i-')) return 'inventory';
            if (prefix.includes('g-')) return 'ground';
            if (prefix.includes('e-')) return 'equipment';
            return 'toolbar';
        },
        removeLocalItem(index, localArray) {
            const itemClone = localArray[index];
            localArray[index] = null;
            return itemClone;
        },
        replaceLocalData(index, replacementItem, localArray) {
            localArray[index] = replacementItem;
        },
        stripCategory(value) {
            return parseInt(value.replace(/.-/gm, ''));
        },
        handleClose(keyPress) {
            if (keyPress.keyCode !== 27) return;
            document.removeEventListener('keyup', this.handleClose);
            setTimeout(() => {
                if ('alt' in window) alt.emit('inventory:Close');
            }, 50);
        },
        setPreviewDisabled(isDisabled) {
            this.disablePreview = isDisabled;
        },
        isFlagEnabled(flags, flagToCheck) {
            let currentFlags = flags;
            let currentFlagToCheck = flagToCheck;
            if ((currentFlags & currentFlagToCheck) !== 0) return true;
            return false;
        },
        setLocales(locales) {
            this.locales = locales;
        }
    },
    computed: {
        getInventory() {
            return this.inventory.items;
        },
        getItemInfo() {
            if (this.itemInfo.includes('g-')) return this.ground[parseInt(this.itemInfo.replace('g-', ''))];
            if (this.itemInfo.includes('t-')) return this.toolbar[parseInt(this.itemInfo.replace('t-', ''))];
            if (this.itemInfo.includes('e-')) return this.equipment[parseInt(this.itemInfo.replace('e-', ''))];
            return this.inventory.items[parseInt(this.itemInfo.replace('i-', ''))];
        },
        getItemProperties() {
            if (this.itemInfo.includes('g-')) {
                const target = this.ground[parseInt(this.itemInfo.replace('g-', ''))];
                if (!target || !target.data) return null;
                return Object.keys(target.data).map((key) => {
                    if (key === 'event') return { key: 'consumeable', value: true };
                    return { key, value: target.data[key] };
                });
            }
            if (this.itemInfo.includes('t-')) {
                const target = this.toolbar[parseInt(this.itemInfo.replace('t-', ''))];
                if (!target || !target.data) return null;
                return Object.keys(target.data).map((key) => {
                    if (key === 'event') return { key: 'consumeable', value: true };
                    return { key, value: target.data[key] };
                });
            }
            if (this.itemInfo.includes('e-')) {
                const target = this.equipment[parseInt(this.itemInfo.replace('e-', ''))];
                if (!target || !target.data) return null;
                return Object.keys(target.data).map((key) => {
                    if (key === 'event') return { key: 'consumeable', value: true };
                    return { key, value: target.data[key] };
                });
            }
            const target = this.inventory.items[parseInt(this.itemInfo.replace('i-', ''))];
            if (!target || !target.data) return null;
            return Object.keys(target.data).map((key) => {
                if (key === 'event') return { key: 'consumeable', value: true };
                return { key, value: target.data[key] };
            });
        }
    },
    mounted() {
        document.addEventListener('keyup', this.handleClose);
        this.inventory = { maxWeight: 15.0, items: new Array(15).fill(null), money: 0.0 };
        this.ground = new Array(8).fill(null);
        this.equipment = new Array(11).fill(null);
        this.toolbar = new Array(5).fill(null);
        if ('alt' in window) {
            alt.on('inventory:Toolbar', this.updateToolbar);
            alt.on('inventory:Inventory', this.updateInventory);
            alt.on('inventory:Equipment', this.updateEquipment);
            alt.on('inventory:Ground', this.updateGround);
            alt.on('inventory:DisablePreview', this.setPreviewDisabled);
            alt.emit('inventory:Update');
            alt.emit('ready');
        } else {
            const items = [];
            for (let i = 0; i < 5; i++) {
                items.push({
                    name: `An Item ${i}`,
                    uuid: `some_hash_thing_${i}`,
                    slot: i,
                    description: `words`,
                    icon: 'crate',
                    quantity: Math.floor(Math.random() * 10),
                    data: { water: 100 }
                });
            }
            items.push({
                name: `Sack`,
                uuid: `some_hash_thing_27`,
                slot: 13,
                description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                icon: 'sack',
                behavior: 2,
                quantity: Math.floor(Math.random() * 10) + 5,
                data: { water: 100, event: 'test' }
            });
            items.push({
                name: `Sack`,
                uuid: `some_hash_thing_27`,
                slot: 14,
                description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                icon: 'sack',
                behavior: 2,
                quantity: Math.floor(Math.random() * 10) + 5,
                data: { water: 100, event: 'test' }
            });
            const ground = [
                {
                    position: { x: 0, y: 0, z: 0 },
                    item: {
                        name: `Gun`,
                        uuid: `some_hash_thing_ground`,
                        description: `Forbidden pez dispenser go brrr.`,
                        icon: 'pipebomb',
                        quantity: 1,
                        hash: '490218490129012',
                        data: { bang: true, ammo: 25, 'gluten-free': true, owner: 'some_guy_off_main', condition: 50, rarity: `A+` }
                    }
                }
            ];
            this.updateToolbar([
                {
                    name: `Hut`,
                    uuid: `some_hash_thing_ground`,
                    description: `Was für ein gemütlicher Hut! Beeindruckend. Sehr gemütlich. Viele Annehmlichkeiten.`,
                    icon: 'hat',
                    slot: 0,
                    quantity: Math.floor(Math.random() * 10),
                    weight: Math.floor(Math.random() * 5),
                    data: { hat: true }
                }
            ]);
            this.updateGround(ground);
            this.updateInventory(items);
            this.updateEquipment([
                {
                    name: `Hut`,
                    uuid: `some_hash_thing_ground`,
                    description: `Was für ein gemütlicher Hut! Beeindruckend. Sehr gemütlich. Viele Annehmlichkeiten.`,
                    icon: 'hat',
                    slot: 0,
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: { event: 'test' }
                }
            ]);
        }
    }
});
