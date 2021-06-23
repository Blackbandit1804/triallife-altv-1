import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent } from '../../shared/utility/enums';

let previousWeather: string = 'OVERCAST';
let weather: string;

let hasPausedClock = false;
let currentTime = { hour: 0, minute: 0 };

alt.onServer(SystemEvent.Time_Update, handleUpdateTime);
alt.onServer(SystemEvent.Weather_Update, handleUpdateWeather);

function handleUpdateTime(hour: number, minute: number): void {
    if (!hasPausedClock) {
        hasPausedClock = true;
        native.pauseClock(true);
    }
    currentTime.hour = hour;
    currentTime.minute = minute;
    native.setClockTime(hour, minute, 0);
}

async function handleUpdateWeather(newWeatherName: string): Promise<void> {
    weather = newWeatherName;
    if (weather !== previousWeather) {
        native.setWeatherTypeOvertimePersist(weather, 30);
        previousWeather = weather;
        native.setForceVehicleTrails(weather === 'XMAS');
        native.setForcePedFootstepsTracks(weather === 'XMAS');
    }
}
