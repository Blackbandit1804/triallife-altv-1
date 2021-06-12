import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/enums/system';
import { sleep } from '../utility/sleep';

alt.onServer(SystemEvent.QUICK_TOKEN_UPDATE, handleUpdateToken);
alt.onServer(SystemEvent.QUICK_TOKEN_FETCH, handleFetchQT);

function handleUpdateToken(hash: string) {
    const instance = alt.LocalStorage.get();
    instance.set('qt', hash);
    instance.save();
}

async function handleFetchQT() {
    const instance = alt.LocalStorage.get();
    const qt = instance.get('qt');

    if (!qt) {
        alt.emitServer(SystemEvent.QUICK_TOKEN_NONE);
        return;
    }

    await sleep(250);

    alt.emitServer(SystemEvent.QUICK_TOKEN_EMIT, qt);
}
