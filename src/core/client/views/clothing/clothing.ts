import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent, ViewEvent } from '../../../shared/utility/enums';
import { ClothingComponent } from '../../../shared/interfaces/clothing';
import { Item } from '../../../shared/interfaces/item';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setShouldDisableControls, setZPos } from '../../utility/camera';
import { HUD } from '../hud/hud';

const url = `http://resource/client/views/clothing/html/index.html`;
let view: View;
let open = false;

alt.on(SystemEvent.Meta_Changed, metaChanged);
alt.onServer(ViewEvent.Clothing_Open, clothingOpen);

async function clothingOpen() {
    view = await View.getInstance(url, true);
    view.on('clothing:Update', clothingUpdate);
    view.on('clothing:Purchase', clothingPurchase);
    view.on('clothing:Populate', clothingPopulate);
    view.on('clothing:Exit', clothingClose);
    view.on('clothing:DisableControls', clothingControls);
    open = true;
    HUD.setHudVisibility(false);
    createPedEditCamera({ x: -0.15, y: -0.5, z: 0 });
    setFov(70);
    setZPos(0.6);
}

function metaChanged(key: string, items: Array<Item>, oldValue: any): void {
    if (key !== 'equipment') return;
    syncEquipment(items);
}

export function syncEquipment(items: Array<Item>) {
    const clothingComponents = new Array(11).fill(null);
    native.clearAllPedProps(alt.Player.local.scriptID);
    if (items && Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
            clothingComponents[items[i].slot] = items[i].data;
        }
    }
    if (alt.Player.local.meta.design.sex === 0) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
    }
    if (!items || !Array.isArray(items)) return;
    clothingUpdate(clothingComponents, true);
}

function clothingControls(value: boolean) {
    setShouldDisableControls(value);
}

function clothingClose() {
    destroyPedEditCamera();
    alt.emitServer(ViewEvent.Clothing_Exit);
    view.close();
    open = false;
    HUD.setHudVisibility(true);
}

function clothingPurchase(index: number, component: ClothingComponent, name: string, desc: string) {
    alt.emitServer(ViewEvent.Clothing_Purchase, index, component, name, desc);
}

export function clothingPopulate(components: Array<ClothingComponent>) {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (!component) continue;
        for (let index = 0; index < component.drawables.length; index++) {
            const id = component.ids[index];
            let value = component.drawables[index];
            let textureValue = component.textures[index];
            let totalTextures = 0;
            let totalDrawables = 0;
            if (component.isProp) {
                value = native.getPedPropIndex(alt.Player.local.scriptID, id);
                component.drawables[index] = value;
                textureValue = native.getPedPropTextureIndex(alt.Player.local.scriptID, id);
                component.textures[index] = textureValue;
                totalDrawables = native.getNumberOfPedPropDrawableVariations(alt.Player.local.scriptID, id);
                totalTextures = native.getNumberOfPedPropTextureVariations(alt.Player.local.scriptID, id, value);
                if (totalTextures !== 0) totalTextures -= 1;
            } else {
                value = native.getPedDrawableVariation(alt.Player.local.scriptID, id);
                component.drawables[index] = value;
                textureValue = native.getPedTextureVariation(alt.Player.local.scriptID, id);
                component.textures[index] = textureValue;
                totalDrawables = native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, id);
                totalTextures = native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, id, value);
                if (totalTextures !== 0) totalTextures -= 1;
            }
            component.maxDrawables[index] = totalDrawables - 1;
            component.maxTextures[index] = totalTextures - 1;
        }
    }
    view.emit('clothing:Propagate', components);
}

export function clothingUpdate(components: Array<ClothingComponent>, justSync = false) {
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (!component) continue;
        for (let index = 0; index < component.drawables.length; index++) {
            const texture = component.textures[index];
            const value = component.drawables[index];
            const id = component.ids[index];
            if (component.isProp) {
                if (value <= -1) {
                    native.clearPedProp(alt.Player.local.scriptID, id);
                    continue;
                }
                native.setPedPropIndex(alt.Player.local.scriptID, id, value, texture, true);
            } else native.setPedComponentVariation(alt.Player.local.scriptID, id, value, texture, 0);
        }
    }
    if (justSync) return;
    if (!open) return;
    clothingPopulate(components);
}
