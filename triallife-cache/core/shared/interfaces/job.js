var ObjectiveCriteria;
(function (ObjectiveCriteria) {
    ObjectiveCriteria[ObjectiveCriteria["NO_VEHICLE"] = 1] = "NO_VEHICLE";
    ObjectiveCriteria[ObjectiveCriteria["NO_WEAPON"] = 2] = "NO_WEAPON";
    ObjectiveCriteria[ObjectiveCriteria["NO_DYING"] = 4] = "NO_DYING";
    ObjectiveCriteria[ObjectiveCriteria["IN_VEHICLE"] = 8] = "IN_VEHICLE";
})(ObjectiveCriteria || (ObjectiveCriteria = {}));
var ObjectiveType;
(function (ObjectiveType) {
    ObjectiveType[ObjectiveType["WAYPOINT"] = 1] = "WAYPOINT";
    ObjectiveType[ObjectiveType["CAPTURE_POINT"] = 2] = "CAPTURE_POINT";
})(ObjectiveType || (ObjectiveType = {}));
var ObjectiveEvents;
(function (ObjectiveEvents) {
    ObjectiveEvents["JOB_SYNC"] = "job:Sync";
    ObjectiveEvents["JOB_VERIFY"] = "job:Verify";
    ObjectiveEvents["JOB_UPDATE"] = "job:Update";
})(ObjectiveEvents || (ObjectiveEvents = {}));
export default {
    ObjectiveCriteria,
    ObjectiveType,
    ObjectiveEvents
};
