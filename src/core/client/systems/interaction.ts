import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/utility/enums';
import { ActionMenu } from '../../shared/interfaces/action';
import { Interaction } from '../../shared/interfaces/interaction';
import { distance2d } from '../../shared/utility/usefull';
import { KEY_BINDS } from '../events/client';
import { HelpManager } from '../views/hud/managers/help';
import { ActionManager } from '../views/hud/managers/action';

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

        if (alt.Player.local.meta.isUnconsciouse) {
            InteractionManager.pressedKey = false;
            dynamicActionMenu = {};
            return;
        }

        //run tick from vehicle manager

        if (Date.now() > NEXT_HELP_CLEAR) {
            NEXT_HELP_CLEAR = Date.now() + 5000;
            delete alt.Player.local.otherInteraction;
            HelpManager.updateHelpText(null, null, null, null);
        }

        if (Date.now() > NEXT_MENU_UPDATE) {
            NEXT_MENU_UPDATE = Date.now() + 1000;
            dynamicActionMenu = {};
            //Handle vehicle menus
        }

        if (alt.Player.local.closestInteraction) {
            const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
            if (dist < MAX_CHECKPOINT_DRAW) {
                dynamicActionMenu[alt.Player.local.closestInteraction.text] = { eventName: SystemEvent.Player_Interact, isServer: true, data: alt.Player.local.closestInteraction.type };
            }
        }

        if (InteractionManager.nextKeyPress > Date.now()) {
            InteractionManager.pressedKey = false;
            return;
        }

        if (Object.keys(dynamicActionMenu).length <= 0) return;
        if (alt.Player.local.closestInteraction && alt.Player.local.closestInteraction.position)
            HelpManager.updateHelpText(alt.Player.local.closestInteraction.position, KEY_BINDS.INTERACT, alt.Player.local.closestInteraction.text, null);
        else if (alt.Player.local.otherInteraction)
            HelpManager.updateHelpText(alt.Player.local.otherInteraction.position, null, alt.Player.local.otherInteraction.short, alt.Player.local.otherInteraction.long);

        if (InteractionManager.pressedKey) {
            InteractionManager.pressedKey = false;
            InteractionManager.nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
            ActionManager.set(dynamicActionMenu);
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
                if (blip.hasOwnProperty('size')) blip.size = { x: interaction.blip.scale, y: interaction.blip.scale } as alt.Vector2;
                blip.sprite = interaction.blip.sprite;
                blip.color = interaction.blip.color;
                blip.shortRange = interaction.blip.shortRange;
                blip.name = interaction.blip.text;
            }
        }
    }
}

alt.onServer(SystemEvent.Interaction_Populate, InteractionManager.addInteractions);
alt.onServer(SystemEvent.Interaction_Set, InteractionManager.setInteractionInfo);
alt.onServer(SystemEvent.Ticks_Start, () => (InteractionManager.tick = alt.setInterval(InteractionManager.handleInteractionMode, 0)));
