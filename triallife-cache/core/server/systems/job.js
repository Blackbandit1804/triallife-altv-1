import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/utility/enums';
import JobEnums from '../../shared/interfaces/job';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/player';
import { distance } from '../utility/vector';
const JobInstances = {};
alt.onClient(JobEnums.ObjectiveEvents.JOB_VERIFY, handleVerify);
alt.onClient(SYSTEM_EVENTS.INTERACTION_JOB_ACTION, handleJobAction);
export class Job {
    name;
    player;
    objectives = [];
    startTime;
    constructor() { }
    addPlayer(player) {
        this.player = player;
        this.name = player.data.name;
        if (JobInstances[this.name])
            JobInstances[this.name].quit(`Arbeit gewechselt`);
        JobInstances[this.name] = this;
        this.startTime = Date.now();
        this.syncObjective();
    }
    addObjective(objectiveData) {
        this.objectives.push(objectiveData);
    }
    loadObjectives(objectiveData) {
        this.objectives = this.objectives.concat(objectiveData);
    }
    checkObjective() {
        const objective = this.getCurrentObjective();
        const passedCritera = this.verifyCriteria(objective);
        if (!passedCritera)
            return false;
        const passedType = this.verifyType(objective);
        if (!passedType)
            return false;
        if (objective.animation && !objective.animation.atObjectiveStart)
            this.tryAnimation();
        if (objective.eventCall && !objective.eventCall.callAtStart)
            this.tryEventCall();
        if (objective.particle)
            playerFuncs.emit.particle(this.player, objective.particle, true);
        this.goToNextObjective();
        return true;
    }
    quit(reason) {
        if (JobInstances[this.player.data.name])
            delete JobInstances[this.player.data.name];
        alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
        playerFuncs.emit.notification(this.player, reason);
    }
    verifyType(objective) {
        if (isFlagEnabled(objective.type, JobEnums.ObjectiveType.WAYPOINT)) {
            if (distance(this.player.pos, objective.pos) <= objective.range) {
                return true;
            }
        }
        if (isFlagEnabled(objective.type, JobEnums.ObjectiveType.CAPTURE_POINT)) {
            if (distance(this.player.pos, objective.pos) > objective.range)
                return false;
            if (objective.captureMaximum === null || objective.captureMaximum === undefined)
                objective.captureMaximum = 10;
            if (!objective.captureProgress)
                objective.captureProgress = 0;
            if (objective.nextCaptureTime && Date.now() < objective.nextCaptureTime)
                return false;
            if (!objective.nextCaptureTime || Date.now() > objective.nextCaptureTime)
                objective.nextCaptureTime = Date.now() + 1000;
            objective.captureProgress += 1;
            if (objective.captureProgress >= objective.captureMaximum)
                return true;
            else
                alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_UPDATE, objective);
        }
        return false;
    }
    verifyCriteria(objective) {
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_VEHICLE)) {
            if (this.player && this.player.vehicle) {
                return false;
            }
        }
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_WEAPON)) {
            if (playerFuncs.inventory.hasWeapon(this.player)) {
                return false;
            }
        }
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.NO_DYING)) {
            if (this.player && this.player.data.isUnconscious) {
                this.quit(`Während der Arbeit bewusstlos geworden.`);
                return false;
            }
        }
        if (isFlagEnabled(objective.criteria, JobEnums.ObjectiveCriteria.IN_VEHICLE)) {
            if (this.player && !this.player.vehicle) {
                return false;
            }
        }
        return true;
    }
    goToNextObjective() {
        this.objectives.shift();
        if (this.objectives.length <= 0) {
            playerFuncs.emit.notification(this.player, `Arbeit beendet`);
            alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
            return;
        }
        this.syncObjective();
    }
    tryEventCall() {
        const objective = this.getCurrentObjective();
        if (objective.eventCall.isServer)
            alt.emit(objective.eventCall.eventName, this.player);
        else
            alt.emitClient(this.player, objective.eventCall.eventName);
    }
    tryAnimation() {
        const objective = this.getCurrentObjective();
        if (!objective.animation)
            return;
        let delay = 0;
        if (objective.animation.delay)
            delay = objective.animation.delay;
        setTimeout(() => {
            if (objective.animation.rotation)
                this.player.rot = objective.animation.rotation;
            alt.nextTick(() => playerFuncs.emit.animation(this.player, objective.animation.dict, objective.animation.name, objective.animation.flags, objective.animation.duration));
        }, delay);
    }
    syncObjective() {
        const objective = this.getCurrentObjective();
        if (objective.animation && objective.animation.atObjectiveStart)
            this.tryAnimation();
        if (objective.eventCall && objective.eventCall.callAtStart)
            this.tryEventCall();
        alt.emitClient(this.player, JobEnums.ObjectiveEvents.JOB_SYNC, objective);
    }
    getCurrentObjective() {
        return this.objectives[0];
    }
}
function handleVerify(player) {
    const instance = JobInstances[player.data.name];
    if (!instance) {
        alt.log(`${player.data.name} has a dead job instance.`);
        alt.emitClient(player, JobEnums.ObjectiveEvents.JOB_SYNC, null);
        return;
    }
    alt.setTimeout(() => instance.checkObjective(), 0);
}
function handleJobAction(player, triggerName) {
    alt.emit(triggerName, player);
}
export function getPlayerJob(player) {
    return JobInstances[player.data.name];
}
