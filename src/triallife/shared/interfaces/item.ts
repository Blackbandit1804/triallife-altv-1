import { ItemTypes, EquipmentTypes } from '../utility/enums';

export interface Item {
    name: string;
    uuid?: string;
    description: string;
    icon: string;
    quantity: number;
    behavior: ItemTypes;
    slot?: number;
    hash?: string;
    equipment?: EquipmentTypes;
    data: { [key: string]: any };
}

export interface ItemSpecial extends Item {
    dataName: string;
    dataIndex: number;
    dataTab?: number;
    isInventory: boolean;
    isEquipment: boolean;
    isToolbar: boolean;
}

export interface DroppedItem {
    item: Item;
    position: { x: number; y: number; z: number };
    gridSpace: number;
    dimension: number;
}
