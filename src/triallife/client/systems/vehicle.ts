import * as alt from 'alt-client';
import * as native from 'natives';
import { VehicleEvent, LockState, VehicleDoorState, SeatList, DoorList } from '../../shared/enums/vehicle';
import { distance, distance2d, getClosestVectorByPos } from '../../shared/utility/vector';
import vehicleFuncs from '../extensions/vehicle';
import { BaseHUD, HudEventNames } from '../views/hud/hud';
import { ActionMenu } from '../../shared/interfaces/actions';
import { ClientVehicleEvent } from '../enums/vehicle';
import { drawTexture, loadTexture } from '../utility/texture';
import { KEY_BINDS } from '../events/keyup';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

alt.onServer(VehicleEvent.SET_INTO, handleSetInto);
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

export class VehicleController {
    static processingVehicles = false;

    // The different states for this controller
    static pressedLockKey: false;
    static pressedVehicleFunction: false;
    static pressedVehicleFunctionAlt: false;

    // Data we look at
    static vehicles: alt.Vehicle[] = [];

    // Cooldown Helpers
    static nextVehicleCheck: number = Date.now();
    static nextControlPress: number = Date.now();
    static nextVehicleStateUpdate: number = Date.now() + TIME_BETWEEN_STATE_UPDATES;

    static putOnSeatbelt() {
        native.setPedConfigFlag(alt.Player.local.scriptID, 35, false); // Helmet
        native.setPedConfigFlag(alt.Player.local.scriptID, 32, false); // Can no longer fly out of windshield.

        const vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
        const isBike = vehClass === 8 || vehClass === 13 ? true : false;

        if (isBike && !native.isPedWearingHelmet(alt.Player.local.scriptID)) {
            native.setPedConfigFlag(alt.Player.local.scriptID, 35, true);
        }

        BaseHUD.setHudStatus(HudEventNames.Seatbelt, true);
    }

    /**
     * This controls what keys were pressed and what boolean to change for a key press.
     * Called from the events/keyup.ts file.
     * @static
     * @param {string} booleanName
     * @memberof VehicleController
     */
    static triggerVehicleFunction(booleanName: string): void {
        if (alt.Player.local.isChatOpen) {
            return;
        }

        this[booleanName] = true;
    }

    /**
     * Sets all keypress booleans to false.
     * @static
     * @memberof VehicleController
     */
    static turnOffAllVehicleFunctions(): void {
        VehicleController.pressedLockKey = false;
        VehicleController.pressedVehicleFunction = false;
        VehicleController.pressedVehicleFunctionAlt = false;
    }

    static updateNextKeyPress(): void {
        VehicleController.nextControlPress = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
    }

    static async updateClosestVehicles() {
        if (!VehicleController.processingVehicles) {
            return;
        }

        const processedVehicles = [];
        const vehicles = [...alt.Vehicle.all];

        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];
            if (distance(alt.Player.local.pos, vehicle.pos) > MAX_VEHICLE_DISTANCE) {
                continue;
            }

            processedVehicles.push(vehicle);
        }

        VehicleController.vehicles = processedVehicles;
        VehicleController.processingVehicles = false;
    }

    /**
     * Get the closest vehicle to the player or the vehicle they are in.
     *
     * @static
     * @return {*}  {alt.Vehicle}
     * @memberof VehicleController
     */
    static getClosestVehicle(): alt.Vehicle {
        if (alt.Player.local.vehicle) {
            return alt.Player.local.vehicle;
        }

        return getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, VehicleController.vehicles);
    }

    static getMaximums(baseEnum: any, maxValue: number, eventName: string): ActionMenu {
        const actions: ActionMenu = {};
        let count = 0;

        Object.keys(baseEnum).forEach((key) => {
            // Remove 0, 1, 2, 3, etc. from enum
            if (parseInt(key, 10) >= -1) {
                return;
            }

            if (count >= maxValue) {
                return;
            }

            // Use actual names for enum.
            actions[key.replace('_', ' ')] = {
                eventName,
                isServer: false,
                data: baseEnum[key]
            };

            count += 1;
        });

        return actions;
    }

    static getVehicleOptions(): ActionMenu {
        const closestVehicle = VehicleController.getClosestVehicle();
        if (!closestVehicle || !closestVehicle.model) {
            return {};
        }

        if (distance2d(closestVehicle.pos, alt.Player.local.pos) > MAX_VEHICLE_DISTANCE) {
            return {};
        }

        const vehicleModel = native.getDisplayNameFromVehicleModel(closestVehicle.model);
        const actions = {
            [vehicleModel]: {}
        };

        // Add Lock Toggle If Owner or Keys
        if (vehicleFuncs.get.owner(closestVehicle)) {
            actions[vehicleModel]['Toggle Lock'] = {
                eventName: ClientVehicleEvent.TOGGLE_LOCK,
                isServer: false
            };
        }

        // Outside Vehicle Actions
        if (!alt.Player.local.vehicle) {
            if (!closestVehicle) {
                return actions;
            }

            const short = `[${String.fromCharCode(KEY_BINDS.INTERACT)}] ${LocaleController.get(LOCALE_KEYS.INTERACTION_INTERACT_VEHICLE)}`;
            const long = `[${String.fromCharCode(KEY_BINDS.VEHICLE_LOCK)}] ${LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_LOCK)}`;
            alt.Player.local.otherInteraction = {
                position: closestVehicle.pos,
                short,
                long
            };

            // Return Current Actions if Vehicle is Locked
            if (closestVehicle.lockStatus === LockState.LOCKED || !closestVehicle.lockStatus) {
                return actions;
            }

            // Generate Seat Menu
            const maxSeats = native.getVehicleMaxNumberOfPassengers(closestVehicle.scriptID) + 1;
            actions[vehicleModel]['Seats'] = VehicleController.getMaximums(SeatList, maxSeats, ClientVehicleEvent.TOGGLE_SEAT);

            // Generate Door Menu
            actions[vehicleModel]['Doors'] = {};

            const vehClass = native.getVehicleClass(closestVehicle.scriptID);
            const isBike = vehClass === 8 || vehClass === 13 ? true : false;

            actions[vehicleModel]['Doors']['Driver'] = {
                eventName: ClientVehicleEvent.TOGGLE_DOOR,
                isServer: false,
                data: DoorList.DRIVER
            };

            actions[vehicleModel]['Doors']['Passenger'] = {
                eventName: ClientVehicleEvent.TOGGLE_DOOR,
                isServer: false,
                data: DoorList.PASSENGER
            };

            if (!isBike) {
                actions[vehicleModel]['Doors']['Driver Rear'] = {
                    eventName: ClientVehicleEvent.TOGGLE_DOOR,
                    isServer: false,
                    data: DoorList.DRIVER_REAR
                };

                actions[vehicleModel]['Doors']['Passenger Rear'] = {
                    eventName: ClientVehicleEvent.TOGGLE_DOOR,
                    isServer: false,
                    data: DoorList.PASSENGER_REAR
                };

                actions[vehicleModel]['Doors']['Hood'] = {
                    eventName: ClientVehicleEvent.TOGGLE_DOOR,
                    isServer: false,
                    data: DoorList.HOOD
                };

                actions[vehicleModel]['Doors']['Trunk'] = {
                    eventName: ClientVehicleEvent.TOGGLE_DOOR,
                    isServer: false,
                    data: DoorList.TRUNK
                };
            }

            return actions;
        }

        // In Vehicle Actions
        if (alt.Player.local.vehicle) {
            const id = alt.Player.local.scriptID;
            const isDriver = native.getPedInVehicleSeat(closestVehicle.scriptID, -1, false) === id;

            // Toggle the engine.
            if (isDriver) {
                actions[vehicleModel]['Toggle Engine'] = {
                    eventName: ClientVehicleEvent.TOGGLE_ENGINE,
                    isServer: false
                };
            }

            // Exit the vehicle
            if (closestVehicle.lockStatus !== LockState.LOCKED && closestVehicle.lockStatus) {
                actions[vehicleModel]['Exit Vehicle'] = {
                    eventName: ClientVehicleEvent.TOGGLE_SEAT,
                    isServer: false
                };
            }

            return actions;
        }

        return actions;
    }

    /**
     * Running on an every tick instance.
     * @static
     * @return {*}
     * @memberof VehicleController
     */
    static runVehicleControllerTick(): void {
        if (!VehicleController.processingVehicles) {
            VehicleController.processingVehicles = true;
            alt.setTimeout(VehicleController.updateClosestVehicles, 0);
        }

        // Stop Entering Vehicle
        if (native.getVehiclePedIsEntering(alt.Player.local.scriptID) !== 0) {
            // back
            if (native.isControlJustPressed(0, 33)) {
                native.clearPedTasks(alt.Player.local.scriptID);
            }

            // left
            if (native.isControlJustPressed(0, 34)) {
                native.clearPedTasks(alt.Player.local.scriptID);
            }

            // right
            if (native.isControlJustPressed(0, 35)) {
                native.clearPedTasks(alt.Player.local.scriptID);
            }
        }

        const closestVehicle = VehicleController.getClosestVehicle();
        if (!closestVehicle) {
            VehicleController.pressedVehicleFunction = false;
            VehicleController.pressedVehicleFunctionAlt = false;
            return;
        }

        if (Date.now() > VehicleController.nextVehicleStateUpdate) {
            VehicleController.updateVehicleState(closestVehicle);
        }

        if (distance2d(closestVehicle.pos, alt.Player.local.pos) > MAX_VEHICLE_DISTANCE) {
            return;
        }

        const exceededNextControlCheck = Date.now() > VehicleController.nextControlPress;

        // Draw Vehicle Lock
        if (!alt.Player.local.vehicle) {
            if (!native.hasStreamedTextureDictLoaded('mpsafecracking')) {
                loadTexture('mpsafecracking');
            }

            const newPosition = closestVehicle.pos.add(0, 0, 1);
            if (closestVehicle.lockStatus === LockState.LOCKED || !closestVehicle.lockStatus) {
                drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
            } else {
                drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
            }
        }

        // F - Enter / Exit Vehicle
        if (VehicleController.pressedVehicleFunction && exceededNextControlCheck) {
            VehicleController.pressedVehicleFunction = false;
            VehicleController.updateNextKeyPress();
            VehicleController.enterExitVehicle(closestVehicle, 0);
            return;
        }

        // G - Enter Passenger
        if (!alt.Player.local.vehicle && VehicleController.pressedVehicleFunctionAlt && exceededNextControlCheck) {
            VehicleController.pressedVehicleFunctionAlt = false;
            VehicleController.updateNextKeyPress();
            VehicleController.enterExitVehicle(closestVehicle, 1);
            return;
        }
    }

    static enterExitVehicle(closestVehicle: alt.Vehicle, startingAt: number) {
        const isLocked = closestVehicle.lockStatus === LockState.LOCKED || !closestVehicle.lockStatus;
        if (isLocked) return;
        if (alt.Player.local.vehicle) {
            const id = alt.Player.local.scriptID;
            const isDriver = native.getPedInVehicleSeat(closestVehicle.scriptID, -1, false) === id;
            native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
            if (closestVehicle.engineStatus && isDriver) {
                alt.setTimeout(() => native.setVehicleEngineOn(closestVehicle.scriptID, true, true, false), 500);
            }
            return;
        }
        const maxSeats = native.getVehicleMaxNumberOfPassengers(closestVehicle.scriptID);
        for (let i = startingAt; i < maxSeats; i++) {
            const isSeatFree = native.isVehicleSeatFree(closestVehicle.scriptID, i - 1, false);
            if (isSeatFree) {
                VehicleController.updatePedFlags(closestVehicle);
                native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, i - 1, 2, 1, 0);
                return;
            }
        }
    }

    static handleToggleLock() {
        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
            return;
        }

        const vehicle = VehicleController.getClosestVehicle();
        if (!vehicle) {
            return;
        }

        alt.emitServer(VehicleEvent.SET_LOCK, vehicle);
    }

    static handleToggleEngine() {
        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
            return;
        }

        const vehicle = VehicleController.getClosestVehicle();
        if (!vehicle) {
            return;
        }

        alt.emitServer(VehicleEvent.SET_ENGINE, vehicle);
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
        const vehicle = VehicleController.getClosestVehicle();
        if (!vehicle) {
            return;
        }

        if (vehicle.lockStatus === LockState.LOCKED || !vehicle.lockStatus) {
            return;
        }

        if (alt.Player.local.vehicle) {
            native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
            return;
        }

        VehicleController.updatePedFlags(vehicle);
        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle.scriptID, 2000, seat, 2, 1, 0);
    }

    static handleToggleDoor(door) {
        const vehicle = VehicleController.getClosestVehicle();
        if (!vehicle) {
            return;
        }

        if (vehicle.lockStatus === LockState.LOCKED || !vehicle.lockStatus) {
            return;
        }

        alt.log(door);
        alt.emitServer(VehicleEvent.SET_DOOR, vehicle, door);
    }

    static updateVehicleState(closestVehicle: alt.Vehicle): void {
        VehicleController.nextVehicleStateUpdate = Date.now() + TIME_BETWEEN_STATE_UPDATES;
        alt.setTimeout(() => {
            vehicleFuncs.sync.update(closestVehicle);
        }, 0);
    }
}

async function handleSetInto(vehicle: alt.Vehicle, seat: SeatList) {
    waitingForVehicle = vehicle;
    waitingForSeat = seat;
}

function handleVehicleCreated(vehicle: alt.Vehicle): void {
    if (vehicle !== waitingForVehicle) {
        return;
    }

    native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
    native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
    native.setPedIntoVehicle(alt.Player.local.scriptID, waitingForVehicle.scriptID, waitingForSeat);

    waitingForSeat = null;
    waitingForVehicle = null;
}

async function handleVehicleDataChange(vehicle: alt.Vehicle, key: string, value: any): Promise<void> {
    if (key === VehicleDoorState.DOOR_DRIVER) {
        vehicleFuncs.set.doorState(vehicle, DoorList.DRIVER, value);
        return;
    }

    if (key === VehicleDoorState.DOOR_DRIVER_REAR) {
        vehicleFuncs.set.doorState(vehicle, DoorList.DRIVER_REAR, value);
        return;
    }

    if (key === VehicleDoorState.DOOR_PASSENGER) {
        vehicleFuncs.set.doorState(vehicle, DoorList.PASSENGER, value);
        return;
    }

    if (key === VehicleDoorState.DOOR_PASSENGER_REAR) {
        vehicleFuncs.set.doorState(vehicle, DoorList.PASSENGER_REAR, value);
        return;
    }

    if (key === VehicleDoorState.DOOR_HOOD) {
        vehicleFuncs.set.doorState(vehicle, DoorList.HOOD, value);
        return;
    }

    if (key === VehicleDoorState.DOOR_TRUNK) {
        vehicleFuncs.set.doorState(vehicle, DoorList.TRUNK, value);
        return;
    }

    if (key === VehicleDoorState.LOCK_STATE) {
        vehicleFuncs.set.lockStatus(vehicle, value);
        return;
    }

    // Set Owner
    if (key === VehicleDoorState.OWNER) {
        vehicleFuncs.set.owner(vehicle, value);
        return;
    }

    if (key === VehicleDoorState.ENGINE) {
        vehicleFuncs.set.engine(vehicle, value);
        return;
    }

    if (key === VehicleDoorState.FUEL) {
        vehicleFuncs.set.fuel(vehicle, value);
        return;
    }
}

alt.onServer(VehicleEvent.SET_SEATBELT, VehicleController.putOnSeatbelt);
alt.on(ClientVehicleEvent.TOGGLE_ENGINE, VehicleController.handleToggleEngine);
alt.on(ClientVehicleEvent.TOGGLE_LOCK, VehicleController.handleToggleLock);
alt.on(ClientVehicleEvent.TOGGLE_SEAT, VehicleController.handleToggleSeat);
alt.on(ClientVehicleEvent.TOGGLE_DOOR, VehicleController.handleToggleDoor);
