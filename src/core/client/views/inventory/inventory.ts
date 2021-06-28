import * as alt from 'alt-client';
import * as native from 'natives';
import { SharedConfig } from '../../../shared/configs/settings';
import { SystemEvent, ViewEvent } from '../../../shared/utility/enums';
import { DroppedItem } from '../../../shared/interfaces/item';
import { distance2d } from '../../../shared/utility/usefull';
import { View } from '../../extensions/view';
import { HUD } from '../hud/hud';
import { waitForFalse } from '../../utility/wait';
import { drawMarker } from '../../utility/marker';
import { isAnyMenuOpen } from '../../utility/menus';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const url = `http://resource/client/views/inventory/html/index.html`;
let view: View;
let camera;
let lastDroppedItems: Array<DroppedItem> = [];
let noPedPreview = false;

export class InventoryManager {
    static isOpen = false;
    static drawInterval: number = null;

    static async handleView() {
        if (isAnyMenuOpen()) return;
        if (alt.Player.local.isPhoneOpen) return;
        noPedPreview = false;
        view = await View.getInstance(url, true, false, false);
        view.on('inventory:Update', InventoryManager.updateEverything);
        view.on('inventory:Use', InventoryManager.handleUse);
        view.on('inventory:Process', InventoryManager.handleProcess);
        view.on('inventory:Close', InventoryManager.handleClose);
        view.on('inventory:Split', InventoryManager.handleSplit);
        view.on('inventory:Pickup', InventoryManager.handlePickup);
        alt.toggleGameControls(false);
        InventoryManager.isOpen = true;
        HUD.setHudVisibility(false);
    }

    static handleProcess(selectedSlot, endSlot, hash): void {
        alt.emitServer(ViewEvent.Inventory_Process, selectedSlot, endSlot, hash);
    }

    static handlePickup(hash: string) {
        alt.emitServer(ViewEvent.Inventory_Pickup, hash);
    }

    static async updateEverything(): Promise<void> {
        if (!view) return;
        Object.keys(keyFunctions).forEach((key) => keyFunctions[key]());
        InventoryManager.processClosestGroundItems();
        const didRenderCamera = await InventoryManager.showPreview();
        view.emit('inventory:DisablePreview', !didRenderCamera ? true : false);
    }

    static updateInventory(): void {
        if (!view) return;
        view.emit('inventory:Inventory', alt.Player.local.meta.inventory);
    }

    static async updateEquipment(): Promise<void> {
        if (!view) return;
        view.emit('inventory:Equipment', alt.Player.local.meta.equipment);
    }

    static updateToolbar(): void {
        if (!view) return;
        view.emit('inventory:Toolbar', alt.Player.local.meta.toolbar);
    }

    static handleUse(selectedSlot: string, tab: number): void {
        alt.emitServer(ViewEvent.Inventory_Use, selectedSlot, tab);
    }

    static handleSplit(selectedSlot: string, tab: number, amount: number): void {
        alt.emitServer(ViewEvent.Inventory_Split, selectedSlot, tab, amount);
    }

    static handleClose(): void {
        InventoryManager.isOpen = false;
        native.clearFocus();
        alt.toggleGameControls(true);
        native.renderScriptCams(false, false, 255, true, false, 0);
        native.setCamActive(camera, false);
        native.destroyAllCams(true);
        native.setEntityVisible(alt.Player.local.scriptID, true, false);
        HUD.setHudVisibility(true);
        if (!view) return;
        view.close();
    }

    static processMetaChange(key: string, value: any, oldValue: any): void {
        if (!validKeys.includes(key)) return;
        if (!keyFunctions[key]) return;
        keyFunctions[key]();
    }

    static updateGroundItems(items: Array<DroppedItem>) {
        lastDroppedItems = items;
        if (InventoryManager.drawInterval) {
            alt.clearInterval(InventoryManager.drawInterval);
            InventoryManager.drawInterval = null;
        }
        if (lastDroppedItems.length >= 1) InventoryManager.drawInterval = alt.setInterval(InventoryManager.drawItemMarkers, 0);
        if (!view) return;
        if (!InventoryManager.isOpen) return;
        alt.setTimeout(InventoryManager.processClosestGroundItems, 0);
    }

    static processClosestGroundItems() {
        let itemsNearPlayer = lastDroppedItems.filter((item) => distance2d(item.position, alt.Player.local.pos) <= SharedConfig.MAX_PICKUP_RANGE);
        if (alt.Player.local.vehicle) itemsNearPlayer = [];
        view.emit('inventory:Ground', itemsNearPlayer);
    }

    static drawItemMarkers() {
        for (let i = 0; i < lastDroppedItems.length; i++) {
            const groundItem = lastDroppedItems[i];
            const newPosition = { x: groundItem.position.x, y: groundItem.position.y, z: groundItem.position.z - 0.98 };
            drawMarker(28, newPosition as alt.Vector3, new alt.Vector3(0.25, 0.25, 0.25), new alt.RGBA(0, 181, 204, 200));
        }
    }

    static async showPreview(): Promise<boolean> {
        if (alt.Player.local.vehicle) return false;
        await waitForFalse(native.isPedWalking, alt.Player.local.scriptID);
        const fov = 80;
        const fwd = native.getEntityForwardVector(alt.Player.local.scriptID);
        const pos = { ...alt.Player.local.pos };
        const fwdPos = { x: pos.x + fwd.x * 1.75, y: pos.y + fwd.y * 1.75, z: pos.z + 0.2 };
        camera = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', fwdPos.x, fwdPos.y, fwdPos.z, 0, 0, 0, fov, true, 0);
        native.pointCamAtEntity(camera, alt.Player.local.scriptID, 0, 0, 0, false);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, false);
        return true;
    }
}

const keyFunctions = { inventory: InventoryManager.updateInventory, toolbar: InventoryManager.updateToolbar, equipment: InventoryManager.updateEquipment };
