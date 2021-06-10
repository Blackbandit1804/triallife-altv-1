export function deepCloneObject<T>(data: object): T {
    return JSON.parse(JSON.stringify(data));
}
