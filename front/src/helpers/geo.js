export const getPrimitiveBounds = (prim) => {


    let primBounds = [Infinity, Infinity, -Infinity, -Infinity];
    switch (prim.code) {


        case 'R': { // rectangle
            const [x, y, w, h] = prim.params;
            const x2 = x + w, y2 = y + h;
            primBounds = [
                Math.min(x, x2), Math.min(y, y2),
                Math.max(x, x2), Math.max(y, y2)
            ];
        }
            break;
        case 'L': // line
            {
                const [x, y, x2, y2] = prim.params;
                primBounds = [
                    Math.min(x, x2), Math.min(y, y2),
                    Math.max(x, x2), Math.max(y, y2)
                ];
                break;
            }
        case 'C': // circle
            {
                const [x, y, r] = prim.params;
                primBounds = [x - r, y - r, x + r, y + r];
                break;
            }
    }
    return primBounds;

}

export const expandBounds = (current, add) => {

    return [
        Math.min(current[0], add[0]), Math.min(current[1], add[1]),
        Math.max(current[2], add[2]), Math.max(current[3], add[3])
    ]

}

export const getWH = (arr) => {
    // ... логика ...
    return [arr[2] - arr[0], arr[3] - arr[1]]; // Возвращаем один массив
};