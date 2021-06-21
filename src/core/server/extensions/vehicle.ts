import * as alt from 'alt-server';
import * as IVeh from '../../shared/interfaces/vehicle';
import { VehicleBehavior, VehicleLock_State } from '../../shared/utility/enums';
import createRef from './vehicleFuns/create';
import getter from './vehicleFuns/getter';
import keys from './vehicleFuns/keys';
import save from './vehicleFuns/save';
import setter from './vehicleFuns/setter';
import toggle from './vehicleFuns/toggle';
import utility from './vehicleFuns/utility';

declare module 'alt-server' {
    export interface Vehicle {
        tlrpLockState: VehicleLock_State;
        engineStatus: boolean;
        keys?: Array<string>;
        fuel?: number;
        player_id?: number;
        behavior?: VehicleBehavior;
        data?: Partial<IVeh.Vehicle>;
        nextSave?: number;
        nextUpdate?: number;
    }
}

export const vehicleFuncs = { getter, setter, create: createRef, keys, save, toggle, utility };
