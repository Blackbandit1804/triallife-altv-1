import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../server/enums/tlrp';
import { EventController } from '../../server/systems/tlrpEvent';

EventController.onPlayer(ATHENA_EVENTS_PLAYER.DIED, (player: alt.Player) => {
    alt.log(`[Death Log] ${player.data.name} has died.`);
});
