import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { vehicleFuncs } from '../extensions/vehicle';
import { InventoryController } from '../views/inventory';

const timeBetweenPings = 4950;

alt.onClient(SystemEvent.PLAYER_TICK, handlePing);

function handlePing(player: alt.Player): void {
    if (!player.nextPingTime) player.nextPingTime = Date.now() + timeBetweenPings;
    if (Date.now() < player.nextPingTime) return;
    player.nextPingTime = Date.now() + timeBetweenPings;
    playerFuncs.save.onTick(player);
    playerFuncs.sync.syncedMeta(player);
    playerFuncs.sync.time(player);
    playerFuncs.sync.weather(player);
    if (!player.nextItemSync || Date.now() > player.nextItemSync) {
        player.nextItemSync = Date.now() + DefaultConfig.TIME_BETWEEN_INVENTORY_UPDATES;
        InventoryController.updateDroppedItemsAroundPlayer(player, false);
    }
    if (!player.nextFoodSync || Date.now() > player.nextFoodSync) {
        player.nextFoodSync = Date.now() + DefaultConfig.TIME_BETWEEN_FOOD_UPDATES;
        playerFuncs.sync.food(player);
        playerFuncs.sync.water(player);
    }
    if (!player.nextPlayTime || Date.now() > player.nextPlayTime) {
        player.nextPlayTime = Date.now() + 60000;
        playerFuncs.sync.playTime(player);
    }
    if (player.vehicle) {
        if (!player.vehicle.nextUpdate || Date.now() > player.vehicle.nextUpdate) {
            player.vehicle.nextUpdate = Date.now() + DefaultConfig.TIME_BETWEEN_VEHICLE_UPDATES;
            vehicleFuncs.setter.updateFuel(player.vehicle);
        }
        if (!player.vehicle.nextSave || Date.now() > player.vehicle.nextSave) {
            player.vehicle.nextSave = Date.now() + DefaultConfig.TIME_BETWEEN_VEHICLE_SAVES;
            const owner = alt.Player.all.find((p) => p.id === player.vehicle.player_id);
            if (owner) vehicleFuncs.save.data(owner, player.vehicle);
        }
    }
}
