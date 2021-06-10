import * as alt from 'alt-server';
import { DEFAULT_CONFIG } from '../tlrp/config';
const worldDivision = 6;
const maxY = 8000;
const minY = -4000;
export class World {
    static minMaxGroups;
    static hour = DEFAULT_CONFIG.BOOTUP_HOUR;
    static minute = DEFAULT_CONFIG.BOOTUP_MINUTE;
    static generateGrid(division) {
        let groups = [];
        let total = maxY + Math.abs(minY);
        for (let i = 0; i < division; i++) {
            const result = { maxY: maxY - (total / division) * i, minY: maxY - 2000 - (total / division) * i };
            groups.push(result);
        }
        World.minMaxGroups = groups;
    }
    static updateWorldTime() {
        World.minute += DEFAULT_CONFIG.MINUTES_PER_MINUTE;
        if (World.minute >= 60) {
            World.minute = 0;
            World.hour += 1;
            const endElement = DEFAULT_CONFIG.WEATHER_ROTATION.pop();
            DEFAULT_CONFIG.WEATHER_ROTATION.unshift(endElement);
        }
        if (World.hour >= 24)
            World.hour = 0;
    }
    static getGridSpace(player) {
        const gridSpace = World.minMaxGroups.findIndex((pos) => player && player.valid && player.pos.y > pos.minY && player.pos.y < pos.maxY);
        return gridSpace === -1 ? 0 : gridSpace;
    }
    static getWeatherByGrid(gridIndex) {
        return DEFAULT_CONFIG.WEATHER_ROTATION[gridIndex];
    }
}
alt.setInterval(World.updateWorldTime, 60000);
World.generateGrid(worldDivision);
