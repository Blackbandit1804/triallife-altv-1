import * as alt from 'alt-client';
import * as native from 'natives';
import { VehicleEvents, VehicleLock_State, VehicleState, VehicleSeatList, VehicleDoorList, HudEventNames } from '../../shared/utility/enums';
import { distance, distance2d, getClosestVectorByPos } from '../../shared/utility/usefull';
import vehicleFuncs from '../extensions/Vehicle';
import { HUD } from '../views/hud/hud';
import { ActionMenu } from '../../shared/interfaces/action';
import { drawTexture, loadTexture } from '../utility/texture';
import { KEY_BINDS } from '../events/client';
import { VehicleClientEvent } from '../utility/enums';

alt.onServer(VehicleEvents.SET_INTO, handleSetInto);
alt.on('streamSyncedMetaChange', handleVehicleDataChange);
alt.on('vehicle:Created', handleVehicleCreated);

const TIME_BETWEEN_CONTROL_PRESS = 250;
const TIME_BETWEEN_STATE_UPDATES = 2500;
const MAX_VEHICLE_DISTANCE = 8;

let waitingForVehicle: alt.Vehicle | null = null;
let waitingForSeat: number | null;

if (!native.hasStreamedTextureDictLoaded('mpsafecracking')) {
    loadTexture('mpsafecracking');
}

export class VehicleManager {
    static processingVehicles = false;
    static pressedLockKey: false;
    static pressedVehicleFunction: false;
    static pressedVehicleFunctionAlt: false;
    static vehicles: alt.Vehicle[] = [];
    static nextVehicleCheck: number = Date.now();
    static nextControlPress: number = Date.now();
    static nextVehicleStateUpdate: number = Date.now() + TIME_BETWEEN_STATE_UPDATES;

    static putOnSeatbelt() {
        native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
        native.setPedConfigFlag(alt.Player.local.scriptID, 32, false);
        const vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
        const isBike = vehClass === 8 || vehClass === 13 ? true : false;
        if (isBike && !native.isPedWearingHelmet(alt.Player.local.scriptID)) native.setPedConfigFlag(alt.Player.local.scriptID, 35, true);
        HUD.setHudStatus(HudEventNames.Seatbelt, true);
    }

    static triggerVehicleFunction(booleanName: string): void {
        this[booleanName] = true;
    }

    static turnOffAllVehicleFunctions(): void {
        VehicleManager.pressedLockKey = false;
        VehicleManager.pressedVehicleFunction = false;
        VehicleManager.pressedVehicleFunctionAlt = false;
    }

    static updateNextKeyPress(): void {
        VehicleManager.nextControlPress = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
    }

    static async updateClosestVehicles() {
        if (!VehicleManager.processingVehicles) return;
        const processedVehicles = [];
        const vehicles = [...alt.Vehicle.all];
        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];
            if (distance(alt.Player.local.pos, vehicle.pos) > MAX_VEHICLE_DISTANCE) continue;
            processedVehicles.push(vehicle);
        }
        VehicleManager.vehicles = processedVehicles;
        VehicleManager.processingVehicles = false;
    }

    static getClosestVehicle(): alt.Vehicle {
        if (alt.Player.local.vehicle) return alt.Player.local.vehicle;
        return getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, VehicleManager.vehicles);
    }

    static getMaximums(baseEnum: any, maxValue: number, eventName: string): ActionMenu {
        const actions: ActionMenu = {};
        let count = 0;
        Object.keys(baseEnum).forEach((key) => {
            if (parseInt(key, 10) >= -1) return;
            if (count >= maxValue) return;
            actions[key.replace('_', ' ')] = { eventName, isServer: false, data: baseEnum[key] };
            count += 1;
        });
        return actions;
    }

    static getVehicleOptions(): ActionMenu {
        const closestVehicle = VehicleManager.getClosestVehicle();
        if (!closestVehicle || !closestVehicle.model) return {};
        if (distance2d(closestVehicle.pos, alt.Player.local.pos) > MAX_VEHICLE_DISTANCE) return {};
        const vehicleModel = native.getDisplayNameFromVehicleModel(closestVehicle.model);
        const actions = { [vehicleModel]: {} };
        if (vehicleFuncs.get.owner(closestVehicle)) actions[vehicleModel]['Toggle Lock'] = { eventName: VehicleClientEvent.TOGGLE_LOCK, isServer: false };
        if (!alt.Player.local.vehicle) {
            if (!closestVehicle) return actions;
            const short = `[~g~${String.fromCharCode(KEY_BINDS.INTERACT)}~w~] ~b~Mit Fahrzeug interagieren`;
            const long = `[~g~${String.fromCharCode(KEY_BINDS.VEHICLE_LOCK)}~w~] ~b~Auf-/Abschließen`;
            alt.Player.local.otherInteraction = { position: closestVehicle.pos, short, long };
            if (closestVehicle.lockStatus === VehicleLock_State.LOCKED || !closestVehicle.lockStatus) return actions;
            const maxSeats = native.getVehicleMaxNumberOfPassengers(closestVehicle.scriptID) + 1;
            actions[vehicleModel]['Seats'] = VehicleManager.getMaximums(VehicleSeatList, maxSeats, VehicleClientEvent.TOGGLE_SEAT);
            actions[vehicleModel]['Doors'] = {};
            const vehClass = native.getVehicleClass(closestVehicle.scriptID);
            const isBike = vehClass === 8 || vehClass === 13 ? true : false;
            actions[vehicleModel]['Doors']['Driver'] = { eventName: VehicleClientEvent.TOGGLE_DOOR, isServer: false, data: VehicleDoorList.DRIVER };
            actions[vehicleModel]['Doors']['Passenger'] = { eventName: VehicleClientEvent.TOGGLE_DOOR, isServer: false, data: VehicleDoorList.PASSENGER };
            if (!isBike) {
                actions[vehicleModel]['Doors']['Driver Rear'] = { eventName: VehicleClientEvent.TOGGLE_DOOR, isServer: false, data: VehicleDoorList.DRIVER_REAR };
                actions[vehicleModel]['Doors']['Passenger Rear'] = { eventName: VehicleClientEvent.TOGGLE_DOOR, isServer: false, data: VehicleDoorList.PASSENGER_REAR };
                actions[vehicleModel]['Doors']['Hood'] = { eventName: VehicleClientEvent.TOGGLE_DOOR, isServer: false, data: VehicleDoorList.HOOD };
                actions[vehicleModel]['Doors']['Trunk'] = { eventName: VehicleClientEvent.TOGGLE_DOOR, isServer: false, data: VehicleDoorList.TRUNK };
            }
            return actions;
        }
        if (alt.Player.local.vehicle) {
            const id = alt.Player.local.scriptID;
            const isDriver = native.getPedInVehicleSeat(closestVehicle.scriptID, -1, false) === id;
            if (isDriver) actions[vehicleModel]['Toggle Engine'] = { eventName: VehicleClientEvent.TOGGLE_ENGINE, isServer: false };
            if (closestVehicle.lockStatus !== VehicleLock_State.LOCKED && closestVehicle.lockStatus)
                actions[vehicleModel]['Exit Vehicle'] = { eventName: VehicleClientEvent.TOGGLE_SEAT, isServer: false };
            return actions;
        }
        return actions;
    }

    static runVehicleManagerTick(): void {
        if (!VehicleManager.processingVehicles) {
            VehicleManager.processingVehicles = true;
            alt.setTimeout(VehicleManager.updateClosestVehicles, 0);
        }
        if (native.getVehiclePedIsEntering(alt.Player.local.scriptID) !== 0) {
            if (native.isControlJustPressed(0, 33)) native.clearPedTasks(alt.Player.local.scriptID);
            if (native.isControlJustPressed(0, 34)) native.clearPedTasks(alt.Player.local.scriptID);
            if (native.isControlJustPressed(0, 35)) native.clearPedTasks(alt.Player.local.scriptID);
        }
        const closestVehicle = VehicleManager.getClosestVehicle();
        if (!closestVehicle) {
            VehicleManager.pressedVehicleFunction = false;
            VehicleManager.pressedVehicleFunctionAlt = false;
            return;
        }
        if (Date.now() > VehicleManager.nextVehicleStateUpdate) VehicleManager.updateVehicleState(closestVehicle);
        if (distance2d(closestVehicle.pos, alt.Player.local.pos) > MAX_VEHICLE_DISTANCE) return;
        const exceededNextControlCheck = Date.now() > VehicleManager.nextControlPress;
        if (!alt.Player.local.vehicle) {
            if (!native.hasStreamedTextureDictLoaded('mpsafecracking')) loadTexture('mpsafecracking');
            const newPosition = closestVehicle.pos.add(0, 0, 1);
            if (closestVehicle.lockStatus === VehicleLock_State.LOCKED || !closestVehicle.lockStatus) drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
            else drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
        }
        if (VehicleManager.pressedVehicleFunction && exceededNextControlCheck) {
            VehicleManager.pressedVehicleFunction = false;
            VehicleManager.updateNextKeyPress();
            VehicleManager.enterExitVehicle(closestVehicle, 0);
            return;
        }
        if (!alt.Player.local.vehicle && VehicleManager.pressedVehicleFunctionAlt && exceededNextControlCheck) {
            VehicleManager.pressedVehicleFunctionAlt = false;
            VehicleManager.updateNextKeyPress();
            VehicleManager.enterExitVehicle(closestVehicle, 1);
            return;
        }
    }

    static enterExitVehicle(closestVehicle: alt.Vehicle, startingAt: number) {
        if (alt.Player.local.vehicle) {
            const id = alt.Player.local.scriptID;
            const isDriver = native.getPedInVehicleSeat(closestVehicle.scriptID, -1, false) === id;
            native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
            if (closestVehicle.engineStatus && isDriver) alt.setTimeout(() => native.setVehicleEngineOn(closestVehicle.scriptID, true, true, false), 500);
            return;
        }
        const maxSeats = native.getVehicleMaxNumberOfPassengers(closestVehicle.scriptID);
        for (let i = startingAt; i < maxSeats; i++) {
            const isSeatFree = native.isVehicleSeatFree(closestVehicle.scriptID, i - 1, false);
            if (isSeatFree) {
                VehicleManager.updatePedFlags(closestVehicle);
                native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, i - 1, 2, 1, 0);
                return;
            }
        }
    }

    static handleToggleLock() {
        if (alt.Player.local.isPhoneOpen) return;
        const vehicle = VehicleManager.getClosestVehicle();
        if (!vehicle) return;
        alt.emitServer(VehicleEvents.SET_LOCK, vehicle);
    }

    static handleToggleEngine() {
        if (alt.Player.local.isPhoneOpen) return;
        const vehicle = VehicleManager.getClosestVehicle();
        if (!vehicle) return;
        alt.emitServer(VehicleEvents.SET_ENGINE, vehicle);
    }

    static updatePedFlags(vehicle: alt.Vehicle) {
        const vehClass = native.getVehicleClass(vehicle.scriptID);
        const isBike = vehClass === 8 || vehClass === 13 ? true : false;
        if (!isBike) {
            native.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
        } else {
            native.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
            native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
        }
    }

    static handleToggleSeat(seat) {
        const vehicle = VehicleManager.getClosestVehicle();
        if (!vehicle) return;
        if (vehicle.lockStatus === VehicleLock_State.LOCKED || !vehicle.lockStatus) return;
        if (alt.Player.local.vehicle) {
            native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
            return;
        }
        VehicleManager.updatePedFlags(vehicle);
        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle.scriptID, 2000, seat, 2, 1, 0);
    }

    static handleToggleDoor(door) {
        const vehicle = VehicleManager.getClosestVehicle();
        if (!vehicle) return;
        if (vehicle.lockStatus === VehicleLock_State.LOCKED || !vehicle.lockStatus) return;
        alt.log(door);
        alt.emitServer(VehicleEvents.SET_DOOR, vehicle, door);
    }

    static updateVehicleState(closestVehicle: alt.Vehicle): void {
        VehicleManager.nextVehicleStateUpdate = Date.now() + TIME_BETWEEN_STATE_UPDATES;
        alt.setTimeout(() => vehicleFuncs.sync.update(closestVehicle), 0);
    }
}

async function handleSetInto(vehicle: alt.Vehicle, seat: VehicleSeatList) {
    waitingForVehicle = vehicle;
    waitingForSeat = seat;
}

function handleVehicleCreated(vehicle: alt.Vehicle): void {
    if (vehicle !== waitingForVehicle) return;
    native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
    native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
    native.setPedIntoVehicle(alt.Player.local.scriptID, waitingForVehicle.scriptID, waitingForSeat);
    waitingForSeat = null;
    waitingForVehicle = null;
}

async function handleVehicleDataChange(vehicle: alt.Vehicle, key: string, value: any): Promise<void> {
    if (key === VehicleState.DOOR_DRIVER) {
        vehicleFuncs.set.doorState(vehicle, VehicleDoorList.DRIVER, value);
        return;
    }
    if (key === VehicleState.DOOR_DRIVER_REAR) {
        vehicleFuncs.set.doorState(vehicle, VehicleDoorList.DRIVER_REAR, value);
        return;
    }
    if (key === VehicleState.DOOR_PASSENGER) {
        vehicleFuncs.set.doorState(vehicle, VehicleDoorList.PASSENGER, value);
        return;
    }

    if (key === VehicleState.DOOR_PASSENGER_REAR) {
        vehicleFuncs.set.doorState(vehicle, VehicleDoorList.PASSENGER_REAR, value);
        return;
    }
    if (key === VehicleState.DOOR_HOOD) {
        vehicleFuncs.set.doorState(vehicle, VehicleDoorList.HOOD, value);
        return;
    }
    if (key === VehicleState.DOOR_TRUNK) {
        vehicleFuncs.set.doorState(vehicle, VehicleDoorList.TRUNK, value);
        return;
    }
    if (key === VehicleState.LOCK_STATE) {
        vehicleFuncs.set.lockStatus(vehicle, value);
        return;
    }
    if (key === VehicleState.OWNER) {
        vehicleFuncs.set.owner(vehicle, value);
        return;
    }
    if (key === VehicleState.ENGINE) {
        vehicleFuncs.set.engine(vehicle, value);
        return;
    }
    if (key === VehicleState.FUEL) {
        vehicleFuncs.set.fuel(vehicle, value);
        return;
    }
}

alt.onServer(VehicleEvents.SET_SEATBELT, VehicleManager.putOnSeatbelt);
alt.on(VehicleClientEvent.TOGGLE_ENGINE, VehicleManager.handleToggleEngine);
alt.on(VehicleClientEvent.TOGGLE_LOCK, VehicleManager.handleToggleLock);
alt.on(VehicleClientEvent.TOGGLE_SEAT, VehicleManager.handleToggleSeat);
alt.on(VehicleClientEvent.TOGGLE_DOOR, VehicleManager.handleToggleDoor);
