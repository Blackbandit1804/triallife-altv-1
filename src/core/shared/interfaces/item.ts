import { EquipmentType, ItemType } from '../utility/enums';

export interface Item {
    name: string;
    uuid?: string;
    description: string;
    icon: string;
    quantity: number;
    behavior: ItemType;
    slot?: number;
    hash?: string;
    weight?: number;
    equipment?: EquipmentType;
    data: { [key: string]: any };
}

export interface ItemSpecial extends Item {
    dataName: string;
    dataIndex: number;
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
