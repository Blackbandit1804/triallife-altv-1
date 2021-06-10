export function stripCategory(value) {
    return parseInt(value.replace(/.*-/gm, ''));
}
