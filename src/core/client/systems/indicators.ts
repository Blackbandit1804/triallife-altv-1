/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client';
import * as native from 'natives';
let rightIndicator: boolean = false;
let leftIndicator: boolean = false;
let bothIndicator: boolean = false;

alt.onServer('indicator:TicksStart', () => alt.setInterval(toggleIndicators, 0));

function toggleIndicators() {
    if (!alt.Player.local.vehicle) return;
    const vehicle = alt.Player.local.vehicle;
    // A - turn left
    if (native.isControlJustPressed(0, 63)) leftIndicator = true;
    else if (native.isControlJustReleased(0, 63)) leftIndicator = false;
    // D - turn right
    if (native.isControlJustPressed(0, 64)) rightIndicator = true;
    else if (native.isControlJustReleased(0, 64)) rightIndicator = true;
    // X - warning lights
    if (native.isControlJustPressed(0, 64)) bothIndicator = !bothIndicator;
    native.setVehicleIndicatorLights(vehicle.scriptID, 0, rightIndicator || bothIndicator); // R
    native.setVehicleIndicatorLights(vehicle.scriptID, 1, leftIndicator || bothIndicator); // L
}
