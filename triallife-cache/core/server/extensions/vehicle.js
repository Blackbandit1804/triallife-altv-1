import getter from './vehicleFunctions/getter';
import keys from './vehicleFunctions/keys';
import newRef from './vehicleFunctions/create';
import save from './vehicleFunctions/save';
import setter from './vehicleFunctions/setter';
import toggle from './vehicleFunctions/toggle';
import utility from './vehicleFunctions/utility';
export default function onLoad() {
}
export const vehicleFuncs = {
    getter,
    setter,
    new: newRef,
    keys,
    save,
    toggle,
    utility
};
