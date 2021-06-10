import * as alt from 'alt-client';
import { ActionMenu } from '../../shared/interfaces/actions';
export declare class VehicleController {
    static processingVehicles: boolean;
    static pressedLockKey: false;
    static pressedVehicleFunction: false;
    static pressedVehicleFunctionAlt: false;
    static vehicles: alt.Vehicle[];
    static nextVehicleCheck: number;
    static nextControlPress: number;
    static nextVehicleStateUpdate: number;
    static putOnSeatbelt(): void;
    static triggerVehicleFunction(booleanName: string): void;
    static turnOffAllVehicleFunctions(): void;
    static updateNextKeyPress(): void;
    static updateClosestVehicles(): Promise<void>;
    static getClosestVehicle(): alt.Vehicle;
    static getMaximums(baseEnum: any, maxValue: number, eventName: string): ActionMenu;
    static getVehicleOptions(): ActionMenu;
    static runVehicleControllerTick(): void;
    static enterExitVehicle(closestVehicle: alt.Vehicle, startingAt: number): void;
    static handleToggleLock(): void;
    static handleToggleEngine(): void;
    static updatePedFlags(vehicle: alt.Vehicle): void;
    static handleToggleSeat(seat: any): void;
    static handleToggleDoor(door: any): void;
    static updateVehicleState(closestVehicle: alt.Vehicle): void;
}
