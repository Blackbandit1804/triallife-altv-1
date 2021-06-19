import * as alt from 'alt-client';
import { distance2d } from '../utility/vector';

const blips: { [key: string]: Array<Blip> } = {};

export class Blip extends alt.PointBlip {
    public maxDrawDistance: number | null;

    constructor(pos: alt.Vector3, sprite: number, color: number, name: string, shortRange = true) {
        super(pos.x, pos.y, pos.z);
        this.sprite = sprite;
        this.color = color;
        this.shortRange = shortRange;
        this.name = name;
    }

    destroyFromCategory(categoryName: string): void {
        if (!blips[categoryName]) return;
        const index = blips[categoryName].findIndex((x) => x === this);
        if (index <= -1) {
            this.destroy();
            return;
        }
        blips[categoryName].splice(index, 1);
        this.destroy();
    }

    addMaxDrawDistance(distance: number | null): void {
        this.maxDrawDistance = distance;
    }

    addCategory(categoryName: string): void {
        if (!blips[categoryName]) blips[categoryName] = [];
        blips[categoryName].push(this);
    }

    updateProperty(propertyName: string, value: any): void {
        if (!this[propertyName]) {
            alt.logWarning(`Blip Property Name: ${propertyName} does not exist.`);
            return;
        }
        this[propertyName] = value;
        this.updateBlip();
    }

    public static async clearEntireCategory(categoryName: string): Promise<boolean> {
        if (!blips[categoryName] || !Array.isArray(blips[categoryName])) return true;
        return new Promise((resolve) => {
            while (blips[categoryName].length > 0) blips[categoryName].pop().destroy();
            return resolve(true);
        });
    }

    public static getBlipsInCategory(categoryName: string): Array<Blip> {
        if (!blips[categoryName] || !Array.isArray(blips[categoryName])) return [];
        return blips[categoryName];
    }

    private updateBlip(): void {
        this.sprite = this.sprite;
        this.color = this.color;
        this.shortRange = this.shortRange;
        this.name = this.name;
    }
}

export class StreamBlip {
    private blip: Blip;
    private category: string;
    private sprite: number;
    private color: number;
    private shortRange: boolean;
    private name: string;
    private maxDistance: number | null;
    public pos: alt.Vector3;

    constructor(pos: alt.Vector3, sprite: number, color: number, name: string, category: string | null, maxDistance: number | null, shortRange = true) {
        this.pos = pos;
        this.sprite = sprite;
        this.color = color;
        this.shortRange = shortRange;
        this.name = name;
        this.maxDistance = maxDistance;
        this.category = category;

        if (this.maxDistance) return;
        this.safeCreate();
    }

    safeCreate(): void {
        if (this.blip) return;
        this.blip = new Blip(this.pos, this.sprite, this.color, this.name, this.shortRange);
        if (this.category) this.blip.addCategory(this.category);
    }

    safeDestroy(): void {
        if (!this.blip) return;
        if (this.category) {
            this.blip.destroyFromCategory(this.category);
            this.blip = null;
        } else {
            this.blip.destroy();
            this.blip = null;
        }
    }
}
