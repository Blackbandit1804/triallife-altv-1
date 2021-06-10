import { Item } from '../interfaces/item';
export declare const ItemRegistry: Array<Item>;
export declare function appendToItemRegistry(item: Item): void;
export declare function getFromRegistry(name: string): Item | null;
