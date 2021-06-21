import * as alt from 'alt-server';
import { DefaultConfig } from '../configs/settings';

const worldDivision = 6;
const maxY = 8000;
const minY = -4000;

export class World {
    static minMaxGroups: Array<{ minY: number; maxY: number }>;
    static hour: number = DefaultConfig.BOOTUP_HOUR;
    static minute: number = DefaultConfig.BOOTUP_MINUTE;

    static generateGrid(division: number): void {
        let groups: Array<{ minY: number; maxY: number }> = [];
        let total = maxY + Math.abs(minY);
        for (let i = 0; i < division; i++) {
            const result = { maxY: maxY - (total / division) * i, minY: maxY - 2000 - (total / division) * i };
            groups.push(result);
        }
        World.minMaxGroups = groups;
    }

    static updateWorldTime(): void {
        World.minute += DefaultConfig.MINUTES_PER_MINUTE;
        if (World.minute >= 60) {
            World.minute = 0;
            World.hour += 1;
            const endElement = DefaultConfig.WEATHER_ROTATION.pop();
            DefaultConfig.WEATHER_ROTATION.unshift(endElement);
        }
        if (World.hour >= 24) World.hour = 0;
    }

    static getGridSpace(player: alt.Player): number {
        const gridSpace = World.minMaxGroups.findIndex((pos) => player && player.valid && player.pos.y > pos.minY && player.pos.y < pos.maxY);
        return gridSpace === -1 ? 0 : gridSpace;
    }

    static getWeatherByGrid(gridIndex: number): string {
        return DefaultConfig.WEATHER_ROTATION[gridIndex];
    }
}

alt.setInterval(World.updateWorldTime, 60000);
World.generateGrid(worldDivision);
