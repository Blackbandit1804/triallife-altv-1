export var AnimationFlags;
(function (AnimationFlags) {
    AnimationFlags[AnimationFlags["NORMAL"] = 0] = "NORMAL";
    AnimationFlags[AnimationFlags["REPEAT"] = 1] = "REPEAT";
    AnimationFlags[AnimationFlags["STOP_LAST_FRAME"] = 2] = "STOP_LAST_FRAME";
    AnimationFlags[AnimationFlags["UPPERBODY_ONLY"] = 16] = "UPPERBODY_ONLY";
    AnimationFlags[AnimationFlags["ENABLE_PLAYER_CONTROL"] = 32] = "ENABLE_PLAYER_CONTROL";
    AnimationFlags[AnimationFlags["CANCELABLE"] = 120] = "CANCELABLE";
})(AnimationFlags || (AnimationFlags = {}));
