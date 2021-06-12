import * as alt from 'alt-server';
import { Behavior, LockState } from '../../shared/enums/vehicle';
import getter from './vehicleFunctions/getter';
import keys from './vehicleFunctions/keys';
import createRef from './vehicleFunctions/create';
import save from './vehicleFunctions/save';
import setter from './vehicleFunctions/setter';
import toggle from './vehicleFunctions/toggle';
import utility from './vehicleFunctions/utility';
import * as IVeh from '../../shared/interfaces/Vehicle';

declare module 'alt-server' {
    export interface Vehicle {
        lockStatus: LockState;
        engineStatus: boolean;
        keys?: Array<string>;
        fuel?: number;
        player_id?: number;
        behavior?: Behavior;
        data?: Partial<IVeh.Vehicle>; // Special Vehicle Information
        nextSave?: number;
        nextUpdate?: number;
    }
}

export default function onLoad() {
    //
}

export const vehicleFuncs = {
    getter,
    setter,
    create: createRef,
    keys,
    save,
    toggle,
    utility
};
