import { Player } from 'alt-server';
import './clothing';
export declare function goToCharacterSelect(player: Player): Promise<void>;
export declare function handleSelectCharacter(player: Player, id: string): Promise<void>;
export declare function handleNewCharacter(player: Player): void;
