type Flags = Permissions;

export function isFlagEnabled(flags: Flags | number, flagToCheck: Flags | number): boolean {
    let currentFlags: number = flags as number;
    let currentFlagToCheck: number = flagToCheck as number;
    return (currentFlags & currentFlagToCheck) !== 0;
}
