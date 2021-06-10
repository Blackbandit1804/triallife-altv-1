export function isFlagEnabled(flags, flagToCheck) {
    let currentFlags = flags;
    let currentFlagToCheck = flagToCheck;
    return (currentFlags & currentFlagToCheck) !== 0;
}
