/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import { Vector3 } from 'alt-client';

import getter from './vehicleFunctions/getter';
import setter from './vehicleFunctions/setter';
import play from './vehicleFunctions/play';
import sync from './vehicleFunctions/sync';
import toggle from './vehicleFunctions/toggle';
import { Vehicle_Lock_State } from '../../shared/utility/enums';

alt.on('gameEntityCreate', handleEntityCreation);

export interface DoorData {
    pos: Vector3;
    seat: number;
    isDoor?: boolean;
}

declare module 'alt-client' {
    export interface Vehicle {
        doorStates: { [doorNumber: number]: boolean };
        owner: number;
        engineStatus: boolean;
        lockStatus: number | Vehicle_Lock_State;
        fuel: number;
    }
}

function handleEntityCreation(entity: alt.Entity): void {
    if (!(entity instanceof alt.Vehicle)) return;
    alt.setTimeout(() => {
        alt.emit('vehicle:Created', entity);
        sync.update(entity);
    }, 250);
}

export default {
    get: getter,
    set: setter,
    play,
    sync,
    toggle
};
