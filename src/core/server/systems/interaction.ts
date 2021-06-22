import * as alt from 'alt-server';
import gridData from '../../shared/configs/grid-data';
import { SystemEvent, ViewEvent } from '../../shared/utility/enums';
import { Blip } from '../../shared/interfaces/blip';
import { Interaction } from '../../shared/interfaces/interaction';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { distance2d } from '../utility/vector';
import Logger from '../utility/Logger';
//import '../views/atm';

interface InteractionHelper {
    [key: string]: Array<alt.Colshape>;
}

interface InteractionDefault {
    eventName: string;
    isServer: boolean;
    maxRadius?: number;
    text?: string;
}

let customInteractions: Array<Interaction> = [];

export class InteractionManager {
    static Interactions: InteractionHelper = {};
    static InteractionTypes: { [key: string]: InteractionDefault } = {
        atm: { eventName: SystemEvent.Atm_Open, isServer: false, text: 'Bankautomat nutzen' },
        gas: { eventName: SystemEvent.Fuel_Action, isServer: true, maxRadius: 3, text: 'Zapfsäule nutzen' },
        clothing: { eventName: ViewEvent.Clothing_Open, isServer: false, text: 'Kleidung durchsuchen' },
        interior: { eventName: SystemEvent.Interior_Switch, isServer: true, text: 'Mit Haus interagieren' }
    };

    static generateInteractions() {
        let count = 0;
        gridData.forEach((grid) => {
            Object.keys(grid.objects).forEach((key) => {
                const category = key;
                const interaction = InteractionManager.InteractionTypes[category];
                if (!interaction) return;
                let defaultRadius = 2.5;
                if (interaction && interaction.maxRadius) defaultRadius = interaction.maxRadius;
                const infoData: Array<{ position: alt.Vector3 }> = grid.objects[key];
                infoData.forEach((info) => {
                    const newPos = new alt.Vector3(info.position.x, info.position.y, info.position.z - 1);
                    const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, defaultRadius, 2.5);
                    shape.playersOnly = true;
                    shape['isInteraction'] = true;
                    shape['interactionType'] = category;
                    shape['text'] = interaction.text;
                    if (!InteractionManager.Interactions[category]) InteractionManager.Interactions[category] = [];
                    count += 1;
                    InteractionManager.Interactions[category].push(shape);
                });
            });
        });
        Logger.log(`Generated ${count} Interaction Points`);
    }

    static addInteraction(identifierAndEventName: string, position: alt.IVector3, range: number, activationText: string, blip: Blip, isServerEvent: boolean) {
        const newPos = new alt.Vector3(position.x, position.y, position.z - 1);
        const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, range, 2.5);
        shape.playersOnly = true;
        shape['isInteraction'] = true;
        shape['interactionType'] = identifierAndEventName;
        shape['text'] = activationText;
        if (!InteractionManager.Interactions[identifierAndEventName]) InteractionManager.Interactions[identifierAndEventName] = [];
        customInteractions.push({ identifier: identifierAndEventName, blip, text: activationText });
        InteractionManager.Interactions[identifierAndEventName].push(shape);
        InteractionManager.InteractionTypes[identifierAndEventName] = { eventName: identifierAndEventName, isServer: isServerEvent };
    }

    static sideLoadInteraction(identifier: string, eventName: string, isServer: boolean, shape: alt.Colshape) {
        if (!InteractionManager.Interactions[identifier]) InteractionManager.Interactions[identifier] = [];
        InteractionManager.Interactions[identifier].push(shape);
        InteractionManager.InteractionTypes[identifier] = { eventName: eventName, isServer: isServer };
    }

    static handleEnterInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) return;
        if (!(player instanceof alt.Player)) return;
        const text = colshape['text'] ? colshape['text'] : 'Hier gibt es keine Interaktion';

        alt.emitClient(player, SystemEvent.Interaction_Set, colshape['interactionType'], new alt.Vector3(colshape.pos.x, colshape.pos.y, colshape.pos.z), text);
    }

    static handleLeaveInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) return;
        if (!(player instanceof alt.Player)) return;
        alt.emitClient(player, SystemEvent.Interaction_Set, null);
    }

    static handleInteraction(player: alt.Player, type: string) {
        if (!InteractionManager.Interactions[type]) return;
        const closestInteraction = InteractionManager.Interactions[type].find((interaction) => {
            if (distance2d(interaction.pos, player.pos) <= DefaultConfig.MAX_INTERACTION_DISTANCE) return true;
            return false;
        });
        if (!closestInteraction) {
            playerFuncs.emit.message(player, 'Sie sind zu weit für eine Interaktion entfernt');
            return;
        }
        const interaction = InteractionManager.InteractionTypes[type];
        if (!interaction) {
            playerFuncs.emit.message(player, 'Dies hier scheint keine Interaktion zu haben');
            return;
        }
        if (interaction.isServer) {
            alt.emit(interaction.eventName, player, closestInteraction.pos);
            return;
        }
        alt.emitClient(player, interaction.eventName, closestInteraction.pos);
    }

    static populateCustomInteractions(player: alt.Player) {
        alt.emitClient(player, SystemEvent.Interaction_Populate, customInteractions);
    }
}

alt.on('entityLeaveColshape', InteractionManager.handleLeaveInteraction);
alt.on('entityEnterColshape', InteractionManager.handleEnterInteraction);
alt.onClient(SystemEvent.Player_Interact, InteractionManager.handleInteraction);

InteractionManager.generateInteractions();
