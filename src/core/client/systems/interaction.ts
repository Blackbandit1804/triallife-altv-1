import * as alt from 'alt-client';
import { SharedConfig } from '../../shared/configs/settings';
import { SystemEvent } from '../../shared/enums/system';
import { ActionMenu, Action } from '../../shared/interfaces/actions';
import { Interaction } from '../../shared/interfaces/Interaction';
import { distance2d } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { ActionsManager } from '../views/hud/controllers/actionsManager';
import { HelpManager } from '../views/hud/controllers/helpManager';
import { BaseHUD, HudEventNames } from '../views/hud/hud';
import { VehicleManager } from './vehicle';

const MAX_INTERACTION_DRAW = 4; // Draws the key to press near the object.
const MAX_CHECKPOINT_DRAW = 8;
const TIME_BETWEEN_CHECKS = 500;
let NEXT_MENU_UPDATE = Date.now() + 2000;
let NEXT_HELP_CLEAR = Date.now() + 5000;
let dynamicActionMenu: ActionMenu = {};

export class InteractionManager {
    static customInteractions: Array<Interaction> = [];
    static tick: number;
    static pressedKey: boolean = false;
    static nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;

    static triggerInteraction(): void {
        InteractionManager.pressedKey = true;
    }

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionManager
     */
    static setInteractionInfo(type: string | null, position: alt.Vector3, text: string) {
        if (type === null) {
            alt.Player.local.closestInteraction = null;
            return;
        }

        alt.Player.local.closestInteraction = { type, position, text };
    }

    static handleInteractionMode() {
        if (alt.Player.local.isMenuOpen) {
            InteractionManager.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        if (alt.Player.local.isChatOpen) {
            InteractionManager.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        if (alt.Player.local.meta.isDead) {
            InteractionManager.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        VehicleManager.runVehicleManagerTick();

        if (Date.now() > NEXT_HELP_CLEAR) {
            NEXT_HELP_CLEAR = Date.now() + 5000;
            delete alt.Player.local.otherInteraction;
            HelpManager.updateHelpText(null, null, null, null);
        }

        // Populates the Menu
        if (Date.now() > NEXT_MENU_UPDATE) {
            NEXT_MENU_UPDATE = Date.now() + 1000;
            dynamicActionMenu = {};

            // Populate Vehicle Options
            const vehicleMenus = VehicleManager.getVehicleOptions();
            if (Object.keys(vehicleMenus).length >= 1) {
                dynamicActionMenu = { ...dynamicActionMenu, ...vehicleMenus };
            }
        }

        // Populates Interaction Menu
        if (alt.Player.local.closestInteraction) {
            const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
            if (dist < MAX_CHECKPOINT_DRAW) {
                dynamicActionMenu[alt.Player.local.closestInteraction.text] = {
                    eventName: SystemEvent.INTERACTION,
                    isServer: true,
                    data: alt.Player.local.closestInteraction.type
                };
            }
        }

        // Timeout for Key Presses
        if (InteractionManager.nextKeyPress > Date.now()) {
            InteractionManager.pressedKey = false;
            return;
        }

        // Check that the Dynamic Menu has Items
        if (Object.keys(dynamicActionMenu).length <= 0) {
            return;
        }

        if (alt.Player.local.closestInteraction && alt.Player.local.closestInteraction.position) {
            // Show this when interactions available is populated.
            HelpManager.updateHelpText(
                alt.Player.local.closestInteraction.position,
                KEY_BINDS.INTERACT,
                alt.Player.local.closestInteraction.text,
                null
            );
        } else if (alt.Player.local.otherInteraction) {
            HelpManager.updateHelpText(
                alt.Player.local.otherInteraction.position,
                null,
                alt.Player.local.otherInteraction.short,
                alt.Player.local.otherInteraction.long
            );
        }

        // Open the Dynamic Menu
        if (InteractionManager.pressedKey) {
            InteractionManager.pressedKey = false;
            InteractionManager.nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
            ActionsManager.set(dynamicActionMenu);
        }

        return;
    }

    static addInteractions(customInteractions: Array<Interaction>): void {
        InteractionManager.customInteractions = customInteractions;

        for (let i = 0; i < customInteractions.length; i++) {
            const interaction = customInteractions[i];
            if (interaction.blip) {
                let blip = new alt.PointBlip(interaction.blip.pos.x, interaction.blip.pos.y, interaction.blip.pos.z);
                blip.scale = interaction.blip.scale;

                // Beta Feature? Not implemented yet.
                if (blip.hasOwnProperty('size')) {
                    blip.size = { x: interaction.blip.scale, y: interaction.blip.scale } as alt.Vector2;
                }

                blip.sprite = interaction.blip.sprite;
                blip.color = interaction.blip.color;
                blip.shortRange = interaction.blip.shortRange;
                blip.name = interaction.blip.text;
            }
        }
    }
}

alt.onServer(SystemEvent.POPULATE_INTERACTIONS, InteractionManager.addInteractions);
alt.onServer(SystemEvent.PLAYER_SET_INTERACTION, InteractionManager.setInteractionInfo);
alt.onServer(SystemEvent.TICKS_START, () => {
    InteractionManager.tick = alt.setInterval(InteractionManager.handleInteractionMode, 0);
});
