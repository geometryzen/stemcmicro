import { MaskAndWeight } from './BasisBlade';

export function bladesToArray<T>(map: { [bitmap: number]: MaskAndWeight<T> }) {

    const bitmaps = Object.keys(map).map(function (keyAsString) {
        return parseInt(keyAsString);
    });

    const rez: MaskAndWeight<T>[] = [];
    for (let i = 0; i < bitmaps.length; i++) {
        const bitmap = bitmaps[i];
        const blade = map[bitmap];
        rez.push(blade);
    }
    return rez;
}
