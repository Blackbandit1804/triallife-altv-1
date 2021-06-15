import * as alt from 'alt-client';
import JobEnums, { Objective } from '../../shared/interfaces/Job';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance } from '../../shared/utility/vector';
import { drawMarker } from '../utility/marker';
import { drawText2D, drawText3D } from '../utility/text';
import { BaseHUD, HudEventNames } from '../views/hud/hud';

class ObjectiveManager {
    static objective: Objective | null;
    static interval: number;
    static cooldown: number;
    static blip: alt.Blip;

    static updateObjective(data: Objective | null) {
        ObjectiveManager.objective = data;
    }

    static handleSync(data: Objective | null) {
        if (ObjectiveManager.interval) {
            alt.clearInterval(ObjectiveManager.interval);
        }

        if (ObjectiveManager.blip && ObjectiveManager.blip.destroy) {
            try {
                ObjectiveManager.blip.destroy();
            } catch (err) {}
        }

        if (!data) {
            ObjectiveManager.objective = null;
            BaseHUD.setHudStatus(HudEventNames.Objective, null);
            return;
        }

        if (data.blip) {
            ObjectiveManager.blip = new alt.PointBlip(data.blip.pos.x, data.blip.pos.y, data.blip.pos.z);
            ObjectiveManager.blip.scale = data.blip.scale;

            // Beta Feature? Not implemented yet.
            if (ObjectiveManager.blip.hasOwnProperty('size')) {
                ObjectiveManager.blip.size = { x: data.blip.scale, y: data.blip.scale } as alt.Vector2;
            }

            ObjectiveManager.blip.sprite = data.blip.sprite;
            ObjectiveManager.blip.color = data.blip.color;
            ObjectiveManager.blip.shortRange = data.blip.shortRange;
            ObjectiveManager.blip.name = data.blip.text;
            ObjectiveManager.blip.route = true;
        }

        BaseHUD.setHudStatus(HudEventNames.Objective, data.description);
        ObjectiveManager.objective = data;
        ObjectiveManager.interval = alt.setInterval(ObjectiveManager.verifyObjective, 0);
    }

    private static getVector3Range() {
        return new alt.Vector3(
            ObjectiveManager.objective.range,
            ObjectiveManager.objective.range,
            ObjectiveManager.objective.range
        );
    }

    private static verifyType(dist: number): boolean {
        if (isFlagEnabled(ObjectiveManager.objective.type, JobEnums.ObjectiveType.WAYPOINT)) {
            if (dist <= ObjectiveManager.objective.range) {
                return true;
            }
        }

        if (isFlagEnabled(ObjectiveManager.objective.type, JobEnums.ObjectiveType.CAPTURE_POINT)) {
            if (dist <= ObjectiveManager.objective.range) {
                return true;
            }
        }

        return false;
    }

    private static verifyCriteria(dist: number): boolean {
        if (isFlagEnabled(ObjectiveManager.objective.criteria, JobEnums.ObjectiveCriteria.NO_VEHICLE)) {
            if (alt.Player.local.vehicle) {
                return false;
            }
        }

        if (isFlagEnabled(ObjectiveManager.objective.criteria, JobEnums.ObjectiveCriteria.IN_VEHICLE)) {
            if (!alt.Player.local.vehicle) {
                return false;
            }
        }

        return true;
    }

    private static verifyObjective() {
        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (!ObjectiveManager.objective) {
            return;
        }

        const dist = distance(alt.Player.local.pos, ObjectiveManager.objective.pos);

        if (ObjectiveManager.objective.marker && dist <= ObjectiveManager.objective.range * 25) {
            drawMarker(
                ObjectiveManager.objective.type,
                ObjectiveManager.objective.marker.pos as alt.Vector3,
                ObjectiveManager.getVector3Range(),
                ObjectiveManager.objective.marker.color
            );
        }

        if (ObjectiveManager.objective.textLabel && dist <= ObjectiveManager.objective.range * 10) {
            drawText3D(
                ObjectiveManager.objective.textLabel.data,
                ObjectiveManager.objective.textLabel.pos as alt.Vector3,
                0.4,
                new alt.RGBA(255, 255, 255, 255)
            );
        }

        if (ObjectiveManager.objective.captureProgress >= 1 && dist <= ObjectiveManager.objective.range * 10) {
            const progressText = `${ObjectiveManager.objective.captureProgress}/${ObjectiveManager.objective.captureMaximum}`;
            drawText3D(
                progressText,
                ObjectiveManager.objective.pos as alt.Vector3,
                0.4,
                new alt.RGBA(255, 255, 255, 255)
            );
        }

        if (ObjectiveManager.cooldown && Date.now() < ObjectiveManager.cooldown) {
            return;
        }

        ObjectiveManager.cooldown = Date.now() + 250;

        if (!ObjectiveManager.verifyType(dist)) {
            return;
        }

        if (!ObjectiveManager.verifyCriteria(dist)) {
            return;
        }

        alt.emitServer(JobEnums.ObjectiveEvents.JOB_VERIFY);
    }
}

alt.onServer(JobEnums.ObjectiveEvents.JOB_SYNC, ObjectiveManager.handleSync);
alt.onServer(JobEnums.ObjectiveEvents.JOB_UPDATE, ObjectiveManager.updateObjective);
