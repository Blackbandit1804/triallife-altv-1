import * as alt from 'alt-client';
import getter from './vehicleFunctions/getter';
import setter from './vehicleFunctions/setter';
import play from './vehicleFunctions/play';
import sync from './vehicleFunctions/sync';
import toggle from './vehicleFunctions/toggle';
alt.on('gameEntityCreate', handleEntityCreation);
function handleEntityCreation(entity) {
    if (!(entity instanceof alt.Vehicle))
        return;
    alt.setTimeout(() => {
        alt.emit('vehicle:Created', entity);
        sync.update(entity);
    }, 250);
}
export default {
    get: getter,
    set: setter,
    play,
    sync,
    toggle
};
