export function stripCategory(value: string): number {
    return parseInt(value.replace(/.*-/gm, ''));
}
