import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/player';
import { InteractionManager } from '../../server/systems/interaction';

alt.on('interaction:DoSomething', doSomeInteracting);

function GenerateInteractions() {
    InteractionManager.addInteraction('interaction:DoSomething', { x: 402.397308, y: -1029.67, z: 29.34688 }, 3, 'Do the thing!', null, true);
}

function doSomeInteracting(player: alt.Player) {
    playerFuncs.emit.message(player, 'Nice!');
}

GenerateInteractions();
