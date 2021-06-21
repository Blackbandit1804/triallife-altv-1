import { Blip } from './blip';
import { EventCall } from './event-call';
import { Marker } from './marker';
import { TextLabel } from './text-label';
import { Vector3 } from './vector';
import { JobAnimation } from './animation';
import { Particle } from './particle';

enum ObjectiveCriteria {
    NO_VEHICLE = 1,
    NO_WEAPON = 2,
    NO_DYING = 4,
    IN_VEHICLE = 8
}

enum ObjectiveType {
    WAYPOINT = 1,
    CAPTURE_POINT = 2
}

enum ObjectiveEvents {
    JOB_SYNC = 'job:Sync',
    JOB_VERIFY = 'job:Verify',
    JOB_UPDATE = 'job:Update'
}

export interface Objective {
    criteria: ObjectiveCriteria;
    type: ObjectiveType;
    pos: Vector3;
    range: number;
    description: string;
    captureProgress?: number;
    captureMaximum?: number;
    nextCaptureTime?: number;
    marker?: Marker;
    textLabel?: TextLabel;
    blip?: Blip;
    animation?: JobAnimation;
    eventCall?: EventCall;
    particle?: Particle;
}

export default {
    ObjectiveCriteria,
    ObjectiveType,
    ObjectiveEvents
};
