import economy from './playerFunctions/economy';
import updater from './playerFunctions/updater';
import emit from './playerFunctions/emit';
import inventory from './playerFunctions/inventory';
import create from './playerFunctions/create';
import safe from './playerFunctions/safe';
import save from './playerFunctions/save';
import select from './playerFunctions/select';
import set from './playerFunctions/setter';
import sync from './playerFunctions/sync';
import utility from './playerFunctions/utility';
export default function onLoad() {
}
export const playerFuncs = {
    economy,
    updater,
    emit,
    inventory,
    create,
    safe,
    save,
    select,
    set,
    sync,
    utility
};
