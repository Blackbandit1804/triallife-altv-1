import * as alt from 'alt-server';
import { BehaviorTypes, LockTypes } from '../../shared/utility/enums';
import getter from './vehicleFunctions/getter';
import keys from './vehicleFunctions/keys';
import create from './vehicleFunctions/create';
import save from './vehicleFunctions/save';
import setter from './vehicleFunctions/setter';
import toggle from './vehicleFunctions/toggle';
import utility from './vehicleFunctions/utility';
import * as IVeh from '../../shared/interfaces/Vehicle';

declare module 'alt-server' {
    export interface Vehicle {
        lockStatus: LockTypes;
        engineStatus: boolean;
        keys?: Array<string>;
        fuel?: number;
        player_id?: number;
        behavior?: BehaviorTypes;
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
    create,
    keys,
    save,
    toggle,
    utility
};
