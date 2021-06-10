import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/utility/enums';
import { TextLabel } from '../../shared/interfaces/text-label';
import Logger from '../utility/tlrpLogger';

const globalTextLabels: Array<TextLabel> = [];

export class TextLabelController {
    static add(label: TextLabel) {
        globalTextLabels.push(label);
    }

    static append(label: TextLabel) {
        if (!label.uid) {
            Logger.error(`(${label.data}) Label does not have a unique id (uid).`);
            return;
        }
        TextLabelController.add(label);
        alt.emit(null, SYSTEM_EVENTS.APPEND_TEXTLABELS, label);
    }

    static remove(uid: string): boolean {
        const index = globalTextLabels.findIndex((label) => label.uid === uid);
        if (index <= -1) return false;
        alt.emit(null, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
        globalTextLabels.splice(index, 1);
        return true;
    }

    static populateGlobalLabels(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_TEXTLABELS, globalTextLabels);
    }
}
