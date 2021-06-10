/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Vehicle_Behavior, Vehicle_Lock_State } from '../../shared/utility/enums';
import * as IVeh from '../../shared/interfaces/Vehicle';
declare module 'alt-server' {
    interface Vehicle {
        lockStatus: Vehicle_Lock_State;
        engineStatus: boolean;
        keys?: Array<string>;
        fuel?: number;
        player_id?: number;
        behavior?: Vehicle_Behavior;
        data?: Partial<IVeh.Vehicle>;
        nextSave?: number;
        nextUpdate?: number;
    }
}
export default function onLoad(): void;
export declare const vehicleFuncs: {
    getter: {
        isOwner: (v: alt.Vehicle, target: alt.Player) => boolean;
        lockState: (v: alt.Vehicle) => Vehicle_Lock_State;
        hasFuel: (v: alt.Vehicle) => boolean;
    };
    setter: {
        lock: (v: alt.Vehicle, player: alt.Player, lockState: Vehicle_Lock_State) => boolean;
        doorOpen: (v: alt.Vehicle, player: alt.Player, index: import("../../shared/utility/enums").Vehicle_Door_List, state: boolean, bypass?: boolean) => void;
        updateFuel: (v: alt.Vehicle) => void;
    };
    new: {
        add: (player: alt.Player, data: Partial<IVeh.Vehicle>) => alt.Vehicle;
        despawn: (id: number, player?: alt.Player) => boolean;
        remove: (player: alt.Player, uid: string) => boolean;
        spawn: (player: alt.Player, data: IVeh.Vehicle) => alt.Vehicle;
        tempVehicle: (player: alt.Player, model: string, pos: alt.IVector3, rot: alt.IVector3) => alt.Vehicle;
    };
    keys: {
        give: (veh: alt.Vehicle, target: alt.Player) => boolean;
        has: (veh: alt.Vehicle, target: alt.Player) => boolean;
        remove: (veh: alt.Vehicle, target: alt.Player) => boolean;
    };
    save: {
        data: (owner: alt.Player, vehicle: alt.Vehicle) => Promise<void>;
    };
    toggle: {
        engine: (vehicle: alt.Vehicle, player: alt.Player, bypass?: boolean) => void;
        lock: (vehicle: alt.Vehicle, player: alt.Player, bypass?: boolean) => Vehicle_Lock_State;
    };
    utility: {
        eject: (v: alt.Vehicle, player: alt.Player) => void;
        repair: (v: alt.Vehicle) => void;
        warpInto: (v: alt.Vehicle, player: alt.Player, seat: import("../../shared/utility/enums").Vehicle_Seat_List) => void;
    };
};
