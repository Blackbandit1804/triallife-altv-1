import * as alt from 'alt-server';
import { getDatabase } from 'simplymongo';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { getClosestVectorByPos } from '../../shared/utility/vector';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';
import { distance2d } from '../utility/vector';
import { InteractionController } from './interaction';
class ColshapeInterior extends alt.ColshapeSphere {
    interior;
    isInterior;
    isInteraction;
    interactionType;
    text;
    constructor(interior, isInterior, dimension) {
        const pos = isInterior ? interior.inside : interior.outside;
        super(pos.x, pos.y, pos.z, 3);
        this.isInterior = isInterior;
        this.interior = interior;
        this.isInteraction = true;
        this.interactionType = 'interior';
        this.text = LocaleController.get(LOCALE_KEYS.INTERIOR_INTERACT);
        if (interior.isActuallyOutside) {
            this.dimension = 0;
        }
        else {
            this.dimension = dimension;
        }
        InteractionController.sideLoadInteraction(this.interactionType, SYSTEM_EVENTS.INTERIOR_SWITCH, true, this);
    }
}
const MAXIMUM_EXTERIOR_DISTANCE = 5;
const MAXIMUM_INTERIOR_DISTANCE = 10;
const db = getDatabase();
const interiors = [];
const colshapes = [];
let dimension = 0;
export class InteriorController {
    static async load() {
        const savedInteriors = await db.fetchAllData(Collections.Interiors);
        let count = 0;
        for (let i = 0; i < savedInteriors.length; i++) {
            InteriorController.populate(savedInteriors[i]);
            count += 1;
        }
        Logger.info(`Total Interiors: ${count}`);
    }
    static populate(interior) {
        dimension += 1;
        interior.dimension = dimension;
        const interiorShape = new ColshapeInterior(interior, true, dimension);
        const exteriorShape = new ColshapeInterior(interior, false, dimension);
        colshapes.push(interiorShape);
        colshapes.push(exteriorShape);
        interiors.push(interior);
    }
    static async create(ownerIdentification, interior) {
        if (!interior.outside) {
            Logger.error(`Missing outside position for interior.`);
            return false;
        }
        if (!interior.inside) {
            Logger.error(`Missing outside position for interior.`);
            return false;
        }
        if (!interior.name) {
            Logger.error(`Missing name for interior.`);
            return false;
        }
        if (!interior.forSale) {
            interior.forSale = false;
        }
        if (!interior.lockStatus) {
            interior.lockStatus = false;
        }
        if (!interior.friends) {
            interior.friends = [ownerIdentification];
        }
        if (!interior.factions) {
            interior.factions = [];
        }
        if (!interior.mlos) {
            interior.mlos = [];
        }
        if (!interior.furniture) {
            interior.furniture = [];
        }
        if (!interior.vehicles) {
            interior.vehicles = [];
        }
        if (!interior.storage) {
            interior.storage = [];
        }
        return await db.insertData(interior, Collections.Interiors, true);
    }
    static async remove(interiorID) {
        interiorID = interiorID.toString();
        const index = interiors.findIndex((i) => i._id.toString() === interiorID);
        if (index >= 0) {
            const interiorsRemoved = interiors.splice(index, 1);
            const interior = interiorsRemoved[0];
            if (interior) {
                alt.Player.all.forEach((player) => {
                    if (player.data.interior.toString() === interior._id.toString()) {
                        playerFuncs.safe.setPosition(player, interior.outside.x, interior.outside.y, interior.outside.z);
                    }
                });
            }
        }
        return await db.deleteById(interiorID, Collections.Interiors);
    }
    static isOwner(player, interior) {
        return interior.friends[0] === player.data._id.toString();
    }
    static isOwnerByID(playerID, interior) {
        return interior.friends[0] === playerID.toString();
    }
    static hasAccess(player, interior) {
        let index = interiors.findIndex((i) => i._id.toString() === interior._id.toString());
        if (index <= -1) {
            return false;
        }
        const foundInterior = interiors[index];
        return foundInterior.friends.includes(player.data._id.toString());
    }
    static hasFactionAccess(player) {
        return false;
    }
    static findClosestInterior(player) {
        let index;
        let interior;
        let isInside = false;
        if (player.data.interior) {
            index = interiors.findIndex((i) => i._id.toString() === player.data.interior.toString());
            if (index <= -1) {
                return null;
            }
            interior = interiors[index];
            isInside = true;
        }
        else {
            interior = getClosestVectorByPos(player.pos, interiors, 'outside');
            if (!interior) {
                return null;
            }
            const dist = distance2d(player.pos, interior.outside);
            if (dist > MAXIMUM_EXTERIOR_DISTANCE) {
                interior = getClosestVectorByPos(player.pos, interiors, 'inside');
                const dist = distance2d(player.pos, interior.inside);
                if (dist > MAXIMUM_INTERIOR_DISTANCE) {
                    return null;
                }
                isInside = true;
            }
        }
        return { interior, isInside };
    }
    static switchLocation(player, interior) {
        if (player.data.interior === interior._id.toString()) {
            playerFuncs.safe.setPosition(player, interior.outside.x, interior.outside.y, interior.outside.z);
            player.data.interior = null;
            player.data.pos = interior.outside;
            if (interior.isActuallyOutside) {
                player.data.exterior = null;
                playerFuncs.save.partial(player, {
                    interior: player.data.interior,
                    pos: player.data.pos,
                    exterior: player.data.exterior
                });
            }
            else {
                playerFuncs.save.partial(player, {
                    interior: player.data.interior,
                    pos: player.data.pos
                });
            }
            return true;
        }
        if (interior.lockStatus) {
            playerFuncs.emit.notification(player, `~r~Locked`);
            return false;
        }
        if (player.data.interior) {
            playerFuncs.safe.setPosition(player, interior.inside.x, interior.inside.y, interior.inside.z);
            player.data.interior = interior._id.toString();
            player.data.pos = interior.inside;
            playerFuncs.save.partial(player, {
                interior: player.data.interior,
                pos: player.data.pos
            });
            return true;
        }
        playerFuncs.safe.setPosition(player, interior.inside.x, interior.inside.y, interior.inside.z);
        player.data.exterior = interior.outside;
        player.data.interior = interior._id.toString();
        player.data.pos = interior.outside;
        playerFuncs.save.partial(player, {
            interior: player.data.interior,
            pos: player.data.pos,
            exterior: player.data.exterior
        });
        return true;
    }
    static trySwitch(player, pos) {
        const interior = InteriorController.findClosestInterior(player);
        if (!interior) {
            return;
        }
        InteriorController.switchLocation(player, interior.interior);
    }
}
alt.on(SYSTEM_EVENTS.INTERIOR_SWITCH, InteriorController.trySwitch);
InteriorController.load();
