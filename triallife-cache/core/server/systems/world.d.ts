import * as alt from 'alt-server';
export declare class World {
    static minMaxGroups: Array<{
        minY: number;
        maxY: number;
    }>;
    static hour: number;
    static minute: number;
    static generateGrid(division: number): void;
    static updateWorldTime(): void;
    static getGridSpace(player: alt.Player): number;
    static getWeatherByGrid(gridIndex: number): string;
}
