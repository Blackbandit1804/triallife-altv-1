import * as alt from 'alt-server';
import { Objective } from '../../shared/interfaces/job';
export declare type PlayerDataName = string;
export declare class Job {
    private name;
    private player;
    private objectives;
    private startTime;
    constructor();
    addPlayer(player: alt.Player): void;
    addObjective(objectiveData: Objective): void;
    loadObjectives(objectiveData: Array<Objective>): void;
    checkObjective(): boolean;
    quit(reason: string): void;
    private verifyType;
    private verifyCriteria;
    private goToNextObjective;
    private tryEventCall;
    private tryAnimation;
    private syncObjective;
    getCurrentObjective(): Objective | null;
}
export declare function getPlayerJob(player: alt.Player): Job | null;
