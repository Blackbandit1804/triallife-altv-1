import * as alt from 'alt-server';
import { TextLabel } from '../../shared/interfaces/text-label';
export declare class TextLabelController {
    static add(label: TextLabel): void;
    static append(label: TextLabel): void;
    static remove(uid: string): boolean;
    static populateGlobalLabels(player: alt.Player): void;
}
