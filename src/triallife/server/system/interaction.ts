import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { ViewClothing } from '../../shared/enums/views';
import gridData from '../../shared/configs/grid-data';
import { Blip } from '../../shared/interfaces/blip';
import { Interaction } from '../../shared/interfaces/interaction';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { distance2d } from '../utility/vector';
import '../views/atm';

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

export class InteractionController {
    static Interactions: InteractionHelper = {};

    static InteractionTypes: { [key: string]: InteractionDefault } = {
        atm: {
            eventName: SystemEvent.INTERACTION_ATM,
            isServer: false,
            text: LocaleController.get(LOCALE_KEYS.USE_ATM)
        },
        gas: {
            eventName: SystemEvent.INTERACTION_FUEL,
            isServer: true,
            maxRadius: 3,
            text: LocaleController.get(LOCALE_KEYS.USE_FUEL_PUMP)
        },
        clothing: {
            eventName: ViewClothing.Open,
            isServer: false,
            text: LocaleController.get(LOCALE_KEYS.USE_CLOTHING_STORE)
        },
        interior: {
            eventName: SystemEvent.INTERIOR_SWITCH,
            isServer: true,
            text: LocaleController.get(LOCALE_KEYS.INTERIOR_INTERACT)
        }
    };

    static generateInteractions() {
        let count = 0;
        gridData.forEach((grid) => {
            Object.keys(grid.objects).forEach((key) => {
                const category = key;
                const interaction = InteractionController.InteractionTypes[category];
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
                    if (!InteractionController.Interactions[category])
                        InteractionController.Interactions[category] = [];
                    count += 1;
                    InteractionController.Interactions[category].push(shape);
                });
            });
        });
        alt.log(`[3L:RP] Generated ${count} Interaction Points`);
    }

    static addInteraction(
        identifierAndEventName: string,
        position: alt.IVector3,
        range: number,
        activationText: string,
        blip: Blip,
        isServerEvent: boolean
    ) {
        const newPos = new alt.Vector3(position.x, position.y, position.z - 1);
        const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, range, 2.5);
        shape.playersOnly = true;
        shape['isInteraction'] = true;
        shape['interactionType'] = identifierAndEventName;
        shape['text'] = activationText;
        if (!InteractionController.Interactions[identifierAndEventName])
            InteractionController.Interactions[identifierAndEventName] = [];
        customInteractions.push({ identifier: identifierAndEventName, blip, text: activationText });
        InteractionController.Interactions[identifierAndEventName].push(shape);
        InteractionController.InteractionTypes[identifierAndEventName] = {
            eventName: identifierAndEventName,
            isServer: isServerEvent
        };
    }

    static sideLoadInteraction(identifier: string, eventName: string, isServer: boolean, shape: alt.Colshape) {
        if (!InteractionController.Interactions[identifier]) InteractionController.Interactions[identifier] = [];
        InteractionController.Interactions[identifier].push(shape);
        InteractionController.InteractionTypes[identifier] = { eventName: eventName, isServer: isServer };
    }

    static handleEnterInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) return;
        if (!(player instanceof alt.Player)) return;
        const text = colshape['text'] ? colshape['text'] : LocaleController.get(LOCALE_KEYS.INTERACTION_INVALID_OBJECT);
        alt.emitClient(
            player,
            SystemEvent.PLAYER_SET_INTERACTION,
            colshape['interactionType'],
            new alt.Vector3(colshape.pos.x, colshape.pos.y, colshape.pos.z),
            text
        );
    }

    static handleLeaveInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) return;
        if (!(player instanceof alt.Player)) return;
        alt.emitClient(player, SystemEvent.PLAYER_SET_INTERACTION, null);
    }

    static handleInteraction(player: alt.Player, type: string) {
        if (!InteractionController.Interactions[type]) return;
        const closestInteraction = InteractionController.Interactions[type].find((interaction) => {
            if (distance2d(interaction.pos, player.pos) <= DefaultConfig.MAX_INTERACTION_DISTANCE) return true;
            return false;
        });
        if (!closestInteraction) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERACTION_TOO_FAR_AWAY));
            return;
        }
        const interaction = InteractionController.InteractionTypes[type];
        if (!interaction) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERACTION_INVALID_OBJECT));
            return;
        }
        if (interaction.isServer) {
            alt.emit(interaction.eventName, player, closestInteraction.pos);
            return;
        }
        alt.emitClient(player, interaction.eventName, closestInteraction.pos);
    }

    static populateCustomInteractions(player: alt.Player) {
        alt.emitClient(player, SystemEvent.POPULATE_INTERACTIONS, customInteractions);
    }
}

alt.on('entityLeaveColshape', InteractionController.handleLeaveInteraction);
alt.on('entityEnterColshape', InteractionController.handleEnterInteraction);
alt.onClient(SystemEvent.INTERACTION, InteractionController.handleInteraction);

InteractionController.generateInteractions();
