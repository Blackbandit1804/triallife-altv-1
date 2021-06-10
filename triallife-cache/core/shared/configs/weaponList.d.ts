export interface Weapon {
    hash: number;
    name: string;
    desc?: string;
    type?: string;
    price?: number;
    clip?: number;
    stats?: {
        damage?: number;
        rate?: number;
        accuracy?: number;
        range?: number;
    };
    overall?: number;
}
export declare function getWeaponByName(name: string): Weapon | null;
