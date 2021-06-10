export function distance(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined)
        throw new Error('AddVector => vector1 or vector2 is undefined');
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2));
}
export function distance2d(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined)
        throw new Error('AddVector => vector1 or vector2 is undefined');
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}
export function getClosestVector(pos, arrayOfPositions) {
    arrayOfPositions.sort((a, b) => distance(pos, a) - distance(pos, b));
    return arrayOfPositions[0];
}
export function getClosestVectorByPos(pos, arrayOfPositions, posVariable = 'pos') {
    arrayOfPositions.sort((a, b) => distance(pos, a[posVariable]) - distance(pos, b[posVariable]));
    return arrayOfPositions[0];
}
export function getClosestTypes(pos, elements, maxDistance, mustHaveProperties = [], positionName = 'pos') {
    const newElements = [];
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i] || !elements[i].valid)
            continue;
        if (mustHaveProperties.length >= 1) {
            let isValid = true;
            for (let x = 0; x < mustHaveProperties.length; x++) {
                if (!elements[i][mustHaveProperties[x]]) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid)
                continue;
        }
        if (distance2d(pos, elements[i][positionName]) > maxDistance)
            continue;
        newElements.push(elements[i]);
    }
    return newElements;
}
