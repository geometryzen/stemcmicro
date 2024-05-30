import { MaskAndWeight } from "./BasisBlade";

function compareFn<T>(a: MaskAndWeight<T>, b: MaskAndWeight<T>): number {
    if (a.bitmap < b.bitmap) {
        return -1;
    } else if (a.bitmap > b.bitmap) {
        return +1;
    } else {
        return 0;
    }
}

// TODO: This could be replaced by a more functional implementation using reduce?
export function sortBlades<T>(blades: MaskAndWeight<T>[]): MaskAndWeight<T>[] {
    const rez: MaskAndWeight<T>[] = [];
    for (let i = 0; i < blades.length; i++) {
        const B = blades[i];
        rez.push(B);
    }
    rez.sort(compareFn);
    return rez;
}
