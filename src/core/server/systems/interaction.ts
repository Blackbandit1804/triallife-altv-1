import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { View_Events_Clothing } from '../../shared/enums/views';
import gridData from '../../shared/configs/grid-data';
import { Blip } from '../../shared/interfaces/blip';
import { Interaction } from '../../shared/interfaces/interaction';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleManager } from '../../shared/locale/locale';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/Player';
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

export class InteractionManager {
    static Interactions: InteractionHelper = {};
    static InteractionTypes: { [key: string]: InteractionDefault } = {
        atm: {
            eventName: SystemEvent.INTERACTION_ATM,
            isServer: false,
            text: LocaleManager.get(LOCALE_KEYS.USE_ATM)
        },
        gas: {
            eventName: SystemEvent.INTERACTION_FUEL,
            isServer: true,
            maxRadius: 3,
            text: LocaleManager.get(LOCALE_KEYS.USE_FUEL_PUMP)
        },
        clothing: {
            eventName: View_Events_Clothing.Open,
            isServer: false,
            text: LocaleManager.get(LOCALE_KEYS.USE_CLOTHING_STORE)
        },
        interior: {
            eventName: SystemEvent.INTERIOR_SWITCH,
            isServer: true,
            text: LocaleManager.get(LOCALE_KEYS.INTERIOR_INTERACT)
        }
    };

    /**
     * Generates interaction points based on prop data.
     * @static
     * @memberof InteractionManager
     */
    static generateInteractions() {
        let count = 0;

        gridData.forEach((grid) => {
            Object.keys(grid.objects).forEach((key) => {
                const category = key;
                const interaction = InteractionManager.InteractionTypes[category];

                if (!interaction) {
                    return;
                }

                let defaultRadius = 2.5;
                if (interaction && interaction.maxRadius) {
                    defaultRadius = interaction.maxRadius;
                }

                const infoData: Array<{ position: alt.Vector3 }> = grid.objects[key];
                infoData.forEach((info) => {
                    const newPos = new alt.Vector3(info.position.x, info.position.y, info.position.z - 1);
                    const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, defaultRadius, 2.5);
                    shape.playersOnly = true;
                    shape['isInteraction'] = true;
                    shape['interactionType'] = category;
                    shape['text'] = interaction.text;

                    if (!InteractionManager.Interactions[category]) {
                        InteractionManager.Interactions[category] = [];
                    }

                    count += 1;
                    InteractionManager.Interactions[category].push(shape);
                });
            });
        });

        alt.log(`[Athena] Generated ${count} Interaction Points`);
    }

    /**
     * Used to add an interaction
     * @static
     * @param {string} identifierAndEventName Must be unique. This is your event name.
     * @param {alt.Vector3} position
     * @param {number} range
     * @param {string} activationText What this interaction tells you it will do
     * @param {Blip} blip The blip that goes along with this interaction
     * @param {boolean} isServerEvent Is this a server event or a client event?
     * @memberof InteractionManager
     */
    static addInteraction(identifierAndEventName: string, position: alt.IVector3, range: number, activationText: string, blip: Blip, isServerEvent: boolean) {
        const newPos = new alt.Vector3(position.x, position.y, position.z - 1);
        const shape = new alt.ColshapeCylinder(newPos.x, newPos.y, newPos.z, range, 2.5);
        shape.playersOnly = true;
        shape['isInteraction'] = true;
        shape['interactionType'] = identifierAndEventName;
        shape['text'] = activationText;

        if (!InteractionManager.Interactions[identifierAndEventName]) {
            InteractionManager.Interactions[identifierAndEventName] = [];
        }

        customInteractions.push({ identifier: identifierAndEventName, blip, text: activationText });
        InteractionManager.Interactions[identifierAndEventName].push(shape);
        InteractionManager.InteractionTypes[identifierAndEventName] = {
            eventName: identifierAndEventName,
            isServer: isServerEvent
        };
    }

    /**
     * Forces any ColShape to push events.
     * @static
     * @param {string} identifier
     * @param {string} eventName
     * @param {boolean} isServer
     * @param {alt.Colshape} shape
     * @memberof InteractionManager
     */
    static sideLoadInteraction(identifier: string, eventName: string, isServer: boolean, shape: alt.Colshape) {
        if (!InteractionManager.Interactions[identifier]) {
            InteractionManager.Interactions[identifier] = [];
        }

        InteractionManager.Interactions[identifier].push(shape);
        InteractionManager.InteractionTypes[identifier] = {
            eventName: eventName,
            isServer: isServer
        };
    }

    /**
     * Triggers when a player enters an interaction point.
     * @static
     * @param {alt.Colshape} colshape
     * @param {alt.Entity} player
     * @return {*}
     * @memberof InteractionManager
     */
    static handleEnterInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) {
            return;
        }

        if (!(player instanceof alt.Player)) {
            return;
        }

        const text = colshape['text'] ? colshape['text'] : LocaleManager.get(LOCALE_KEYS.INTERACTION_INVALID_OBJECT);

        alt.emitClient(player, SystemEvent.PLAYER_SET_INTERACTION, colshape['interactionType'], new alt.Vector3(colshape.pos.x, colshape.pos.y, colshape.pos.z), text);
    }

    /**
     * Triggers when a player leaves an interaction point.
     * @static
     * @param {alt.Colshape} colshape
     * @param {alt.Entity} player
     * @memberof InteractionManager
     */
    static handleLeaveInteraction(colshape: alt.Colshape, player: alt.Entity) {
        if (!colshape.hasOwnProperty('isInteraction')) {
            return;
        }

        if (!(player instanceof alt.Player)) {
            return;
        }

        alt.emitClient(player, SystemEvent.PLAYER_SET_INTERACTION, null);
    }

    /**
     * Triggers when a player presses their interaction key from the client-side.
     * @static
     * @param {alt.Player} player
     * @param {string} type
     * @return {*}
     * @memberof InteractionManager
     */
    static handleInteraction(player: alt.Player, type: string) {
        if (!InteractionManager.Interactions[type]) {
            return;
        }

        const closestInteraction = InteractionManager.Interactions[type].find((interaction) => {
            if (distance2d(interaction.pos, player.pos) <= DefaultConfig.MAX_INTERACTION_DISTANCE) {
                return true;
            }

            return false;
        });

        if (!closestInteraction) {
            playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.INTERACTION_TOO_FAR_AWAY));
            return;
        }

        const interaction = InteractionManager.InteractionTypes[type];
        if (!interaction) {
            playerFuncs.emit.message(player, LocaleManager.get(LOCALE_KEYS.INTERACTION_INVALID_OBJECT));
            return;
        }

        // Goes Server Side
        if (interaction.isServer) {
            alt.emit(interaction.eventName, player, closestInteraction.pos);
            return;
        }

        // Goes Client Side
        alt.emitClient(player, interaction.eventName, closestInteraction.pos);
    }

    /**
     * Sends custom interactions to client after connecting.
     * @static
     * @param {alt.Player} player
     * @memberof InteractionManager
     */
    static populateCustomInteractions(player: alt.Player) {
        alt.emitClient(player, SystemEvent.POPULATE_INTERACTIONS, customInteractions);
    }
}

alt.on('entityLeaveColshape', InteractionManager.handleLeaveInteraction);
alt.on('entityEnterColshape', InteractionManager.handleEnterInteraction);
alt.onClient(SystemEvent.INTERACTION, InteractionManager.handleInteraction);

InteractionManager.generateInteractions();
