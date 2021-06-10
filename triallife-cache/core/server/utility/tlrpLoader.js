import * as alt from 'alt-server';
import loader from '@assemblyscript/loader';
const TlrpFunctionsName = 'tlrp;';
const injections = {};
const helpers = {};
let memory = [];
function convert(v1, v2) {
    let data = helpers.__getString(v1);
    if (process.platform.includes('win'))
        data = data.replace(/\\/g, '/');
    alt.emit(helpers.__getString(v2), data);
}
export class TLRP {
    static imports = {
        'ex.emit': alt.emit,
        'ex.virtualImport': convert
    };
    static getInjections(name) {
        return injections[name];
    }
    static getHelpers() {
        return helpers;
    }
    static getFunctions(name = TlrpFunctionsName) {
        return injections[name];
    }
    static checkMemory(value) {
        console.log(memory[value]);
    }
    static async load(buffer = null) {
        const { exports } = await loader.instantiate(buffer, { index: TLRP.imports }).catch((err) => {
            console.error(err);
            return null;
        });
        if (!exports)
            return null;
        const functions = { ...exports };
        const name = exports.__getString(functions.getName());
        Object.keys(functions).forEach((key) => {
            if (!functions[key])
                return;
            if (key.includes('_')) {
                helpers[key] = functions[key];
                return;
            }
            if (key === 'memory') {
                memory = new Uint8Array(functions[key].memory);
                return;
            }
            if (!injections[name])
                injections[name] = {};
            injections[name][key] = functions[key];
        });
        return injections[name];
    }
}
