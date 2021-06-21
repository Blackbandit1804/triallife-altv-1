import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/utility/enums';
import { sleep } from '../utility/sleep';

alt.onServer(SystemEvent.QuickToken_Update, handleUpdateToken);
alt.onServer(SystemEvent.QuickToken_Fetch, handleFetchQT);

function handleUpdateToken(hash: string) {
    const instance = alt.LocalStorage.get();
    instance.set('qt', hash);
    instance.save();
}

async function handleFetchQT() {
    const instance = alt.LocalStorage.get();
    const qt = instance.get('qt');
    if (!qt) {
        alt.emitServer(SystemEvent.QuickToken_None);
        return;
    }
    await sleep(250);
    alt.emitServer(SystemEvent.QuickToken_Emit, qt);
}
