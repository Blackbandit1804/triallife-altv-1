import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/utility/enums';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { vehicleFuncs } from '../extensions/vehicle';
import { InventoryManager } from '../views/inventory';

alt.onClient(SystemEvent.Player_Tick, (player: alt.Player) => {
    if (!player.nextPingTime) player.nextPingTime = Date.now() + 4950;
    if (Date.now() < player.nextPingTime) return;
    player.nextPingTime = Date.now() + 4950;
    playerFuncs.save.onTick(player);
    playerFuncs.sync.syncedMeta(player);
    playerFuncs.sync.time(player);
    playerFuncs.sync.weather(player);

    if (!player.nextItemSync || Date.now() > player.nextItemSync) {
        player.nextItemSync = Date.now() + DefaultConfig.TIME_BETWEEN_INVENTORY_UPDATES;
        InventoryManager.updateDroppedItemsAroundPlayer(player, false);
    }

    if (!player.nextStatSync || Date.now() > player.nextStatSync) {
        player.nextStatSync = Date.now() + DefaultConfig.TIME_BETWEEN_STAT_UPDATES;
        playerFuncs.sync.hunger(player);
        playerFuncs.sync.thirst(player);
        playerFuncs.sync.mood(player);
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
});
