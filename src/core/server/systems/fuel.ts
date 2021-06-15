import * as alt from 'alt-server';
import { SHARED_CONFIG } from '../../shared/configs/settings';
import { CurrencyTypes } from '../../shared/enums/economy';
import { SystemEvent } from '../../shared/enums/system';
import { Vehicle_Behavior, Vehicle_State } from '../../shared/enums/vehicle';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';
import { distance2d } from '../utility/vector';

alt.on(SystemEvent.INTERACTION_FUEL, handleFuel);

// player.id to retrieve
const maximumFuel = 100;
const fuelTimes: { [key: string]: FuelStatus } = {};

interface FuelStatus {
    id: number;
    vehicle: alt.Vehicle;
    endTime: number;
    maxCost: number;
    difFuel: number;
    timeout: number;
}

function handleFuel(player: alt.Player, pos: alt.IVector3) {
    if (player.vehicle) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_EXIT_VEHICLE_FIRST));
        return;
    }

    if (!player.lastEnteredVehicleID) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_UPDATE_VEHICLE_FIRST));
        return;
    }

    if (fuelTimes[player.id]) {
        const fuelStatus = deepCloneObject(fuelTimes[player.id]) as FuelStatus;
        handleFinishFuel(player, fuelStatus);
        fuelTimes[player.id] = null;
        return;
    }

    const lastVehicle = alt.Vehicle.all.find((v) => v.id === player.lastEnteredVehicleID);
    if (!lastVehicle) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_VEHICLE_NOT_CLOSE));
        return;
    }

    if (lastVehicle.fuel >= 99) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_ALREADY_FULL));
        return;
    }

    if (distance2d(lastVehicle.pos, pos) > 5) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_TOO_FAR_FROM_PUMP));
        return;
    }

    if (isFlagEnabled(lastVehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_HAS_UNLIMITED));
        return;
    }

    if (player.data.cash <= 0) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_CANNOT_AFFORD));
        return;
    }

    const currentFuel = lastVehicle.fuel;
    let missingFuel = maximumFuel - currentFuel;
    let maximumCost = missingFuel * SHARED_CONFIG.FUEL_PRICE;

    // re-calculate based on what the player can afford.
    if (player.data.cash < maximumCost) {
        maximumCost = SHARED_CONFIG.FUEL_PRICE * player.data.cash;
        missingFuel = missingFuel - SHARED_CONFIG.FUEL_PRICE * player.data.cash;

        if (missingFuel <= 2) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_CANNOT_AFFORD));
            return;
        }
    }

    const missingFuelPct = (missingFuel / maximumFuel) * 100;
    let maximumTime = (SHARED_CONFIG.FUEL_TIME / 100) * missingFuelPct;
    if (maximumTime < 3000) {
        maximumTime = 3000;
    }

    playerFuncs.emit.notification(
        player,
        LocaleController.get(LOCALE_KEYS.FUEL_PAYMENT, maximumCost.toFixed(2), missingFuel.toFixed(2))
    );

    const newPosition = new alt.Vector3(pos.x, pos.y, pos.z).add(0, 0, 3);
    playerFuncs.emit.createProgressBar(player, {
        uid: `FUEL-${player.data._id.toString()}`,
        color: { r: 255, g: 0, b: 0, a: 200 },
        distance: 15,
        milliseconds: maximumTime,
        position: newPosition,
        text: `Fueling...`
    });

    fuelTimes[player.id] = {
        id: player.id,
        endTime: Date.now() + maximumTime,
        difFuel: missingFuel,
        maxCost: maximumCost,
        vehicle: lastVehicle,
        timeout: alt.setTimeout(() => {
            handleFinishFuel(player, fuelTimes[player.id]);
        }, maximumTime)
    };
}

function handleFinishFuel(player: alt.Player, fuelStatus: FuelStatus) {
    if (!fuelStatus) {
        return;
    }

    if (fuelStatus.timeout) {
        alt.clearTimeout(fuelStatus.timeout);
    }

    if (player.data.cash < fuelStatus.maxCost) {
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FUEL_CANNOT_AFFORD));
        return;
    }

    if (Date.now() >= fuelStatus.endTime) {
        playerFuncs.currency.sub(player, CurrencyTypes.CASH, fuelStatus.maxCost);
        fuelStatus.vehicle.fuel = 100;
        fuelStatus.vehicle.data.fuel = 100;

        const owner = alt.Player.all.find((p) => p.valid && p.id === fuelStatus.vehicle.player_id);
        if (owner) {
            vehicleFuncs.save.data(owner, fuelStatus.vehicle);
        }

        playerFuncs.emit.notification(
            player,
            LocaleController.get(LOCALE_KEYS.FUEL_PAID, fuelStatus.maxCost.toFixed(2), fuelStatus.difFuel.toFixed(2))
        );
        return;
    }

    const timeRemaining = fuelStatus.endTime - Date.now();
    const pctFuelTaken = timeRemaining / SHARED_CONFIG.FUEL_TIME;
    const totalFuel = pctFuelTaken * fuelStatus.difFuel;
    const totalCost = totalFuel * SHARED_CONFIG.FUEL_PRICE;

    playerFuncs.emit.removeProgressBar(player, `FUEL-${player.data._id.toString()}`);

    if (totalCost <= 0) {
        playerFuncs.emit.notification(player, `~r~Something went wrong.`);
        return;
    }

    playerFuncs.currency.sub(player, CurrencyTypes.CASH, totalCost);
    fuelStatus.vehicle.fuel += totalFuel;
    fuelStatus.vehicle.data.fuel += totalFuel;

    if (fuelStatus.vehicle.fuel > 100) {
        fuelStatus.vehicle.fuel = 100;
    }

    if (fuelStatus.vehicle.data.fuel > 100) {
        fuelStatus.vehicle.data.fuel = 100;
    }

    vehicleFuncs.setter.updateFuel(fuelStatus.vehicle);
    fuelStatus.vehicle.fuel = fuelStatus.vehicle.data.fuel;
    fuelStatus.vehicle.setStreamSyncedMeta(Vehicle_State.FUEL, fuelStatus.vehicle.data.fuel);

    const owner = alt.Player.all.find((p) => p.valid && p.id === fuelStatus.vehicle.player_id);
    if (owner) {
        vehicleFuncs.save.data(owner, fuelStatus.vehicle);
    }

    playerFuncs.emit.notification(
        player,
        LocaleController.get(LOCALE_KEYS.FUEL_PAID, totalCost.toFixed(2), totalFuel.toFixed(2))
    );
}
