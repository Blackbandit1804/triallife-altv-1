/// <reference types="@altv/types-server" />
/// <reference types="node" />
import * as alt from 'alt-server';
interface Assembly {
    __getString?(value: number): string;
}
declare function convert(v1: any, v2: any): void;
export interface TlrpFunctions {
    isDoneLoading(): boolean;
    getName(): number;
    getFinishName(): number;
    getLoadName(): number;
    getDatabaseName(): number;
    Math: {
        add(v1: number, v2: number): number;
        sub(v1: number, v2: number): number;
        multiply(v1: number, v2: number): number;
        divide(v1: number, v2: number): number;
        isGreater(v1: number, v2: number): boolean;
        isLesser(v1: number, v2: number): boolean;
        fwdX(x: number, z: number): number;
        fwdY(x: number, z: number): number;
        fwdZ(x: number): number;
        distance2d(x1: number, y1: number, x2: number, y2: number): number;
        distance3d(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number;
        random(min: number, max: number): number;
        randomFloor(min: number, max: number): number;
    };
}
export interface InjectedStarter {
    deploy: () => void;
    getEvent: () => string;
    getName: () => string;
}
export declare class TLRP {
    static imports: {
        'ex.emit': typeof alt.emit;
        'ex.virtualImport': typeof convert;
    };
    static getInjections<T>(name: string): T;
    static getHelpers(): Assembly;
    static getFunctions<T>(name?: string): T;
    static checkMemory(value: number): void;
    static load<T>(buffer?: Buffer): Promise<T | null>;
}
export {};
