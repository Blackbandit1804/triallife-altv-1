import * as native from 'natives';
function door(v, door) {
    if (!v.doorStates) {
        v.doorStates = {};
    }
    v.doorStates[door] = !v.doorStates[door] ? true : false;
    if (!v.doorStates[door]) {
        native.setVehicleDoorShut(v.scriptID, door, false);
        return;
    }
    native.setVehicleDoorOpen(v.scriptID, door, false, false);
}
export default {
    door
};
