import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/utility/enums';
import { Blip } from '../../shared/interfaces/blip';
import gridData from '../../shared/configs/grid-data';

interface DumpBlip {
    name: string;
    hash: string;
    position: alt.IVector3;
    rotation: alt.IVector3;
    isBlip: boolean;
}

const addedBlips: Array<any> = [];
const generatedBlipList = [];
const blipCategories = [
    { name: 'atm', displayName: 'ATM', sprite: 207, color: 2 },
    { name: 'gas', displayName: 'Tankstelle', sprite: 361, color: 1 },
    { name: 'clothing', displayName: 'Kleidungsladen', sprite: 73, color: 24 },
    { name: 'vending', displayName: 'Verkaufsautomat', sprite: 467, color: 62 }
];

for (let i = 0; i < gridData.length; i++) {
    const grid = { ...gridData[i] };
    Object.keys(grid.objects).forEach((key) => (grid.objects[key] = grid.objects[key].filter((data) => data.isBlip)));
    generatedBlipList.push(grid);
}

generatedBlipList.forEach((space) => {
    const objects = space.objects;
    Object.keys(objects).forEach((key) => {
        const category = key;
        const blips = objects[key];
        const blipInfo = blipCategories.find((b) => b.name === category);
        if (!blipInfo) return;
        for (let i = 0; i < blips.length; i++) {
            const blip = blips[i] as DumpBlip;
            create({ pos: blip.position, shortRange: true, scale: 0.8, text: blipInfo.displayName, sprite: blipInfo.sprite, color: blipInfo.color });
        }
    });
});

function create(blipData: Blip): alt.PointBlip {
    const blip = new alt.PointBlip(blipData.pos.x, blipData.pos.y, blipData.pos.z);
    blip.sprite = blipData.sprite;
    blip.color = blipData.color;
    blip.shortRange = blipData.shortRange;
    blip.name = blipData.text;
    if (blipData.uid) blip['uid'] = blipData.uid;
    if (blip.hasOwnProperty('size')) blip.size = { x: blipData.scale, y: blipData.scale } as alt.Vector2;
    else blip.scale = blipData.scale;
    return blip;
}

export class BlipController {
    static append(blipData: Blip): alt.PointBlip {
        const blip = create(blipData);
        addedBlips.push(blip);
        return blip;
    }
    static populate(blips: Array<Blip>) {
        for (let i = 0; i < blips.length; i++) {
            const blipData = blips[i];
            const blip = create(blipData);
            addedBlips.push(blip);
        }
    }
    static remove(uid: string) {
        const index = addedBlips.findIndex((blip) => blip.uid === uid);
        if (index <= -1) return;
        const blip = addedBlips[index];
        addedBlips.splice(index, 1);
        if (!blip || !blip.destroy) return;
        blip.destroy();
    }
}

alt.onServer(SystemEvent.Blip_Populate, BlipController.populate);
alt.onServer(SystemEvent.Blip_Append, BlipController.append);
alt.onServer(SystemEvent.Blip_Remove, BlipController.remove);
