export default function isFunction(funcOrClass) {
    const propertyNames = Object.getOwnPropertyNames(funcOrClass);
    return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
}
