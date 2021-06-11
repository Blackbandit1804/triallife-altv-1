export default function isFunction(funcOrClass: ClassDecorator | Function) {
    const propertyNames = Object.getOwnPropertyNames(funcOrClass);
    return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
}

export function deepCloneObject<T>(data: object): T {
    return JSON.parse(JSON.stringify(data));
}

export function isFlagEnabled(flags: Permissions | number, flagToCheck: Permissions | number): boolean {
    let currentFlags: number = flags as number;
    let currentFlagToCheck: number = flagToCheck as number;
    if ((currentFlags & currentFlagToCheck) !== 0) return true;
    return false;
}
