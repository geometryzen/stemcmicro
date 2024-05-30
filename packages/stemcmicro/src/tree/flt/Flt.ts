import { Flt } from "math-expression-atoms";

// TODO: Use the cache to intern common Flt values.
const cache: Flt[] = [];

/**
 * Constructs a floating point number object from a number primitive.
 * @param value The floating point number value.
 * @param pos The start position of the number in the source text.
 * @param end The end position of the number in the source text.
 */
export function create_flt(value: number, pos?: number, end?: number): Flt {
    if (value === zeroAsFlt.d) {
        return zeroAsFlt;
    }
    if (value === oneAsFlt.d) {
        return oneAsFlt;
    }
    if (value === negOneAsFlt.d) {
        return negOneAsFlt;
    }
    if (value === twoAsFlt.d) {
        return twoAsFlt;
    }
    if (value === negTwoAsFlt.d) {
        return negTwoAsFlt;
    }
    // console.lg("wrap_as_flt", value);
    return new Flt(value, pos, end);
}

export { Flt };

export const zeroAsFlt = new Flt(0.0);
export const oneAsFlt = new Flt(1.0);
export const twoAsFlt = new Flt(2.0);
export const piAsFlt = new Flt(Math.PI);
export const εAsFlt = new Flt(1e-6);
export const eAsFlt = new Flt(Math.E);
export const negOneAsFlt = new Flt(-1.0);
export const negTwoAsFlt = new Flt(-2.0);

cache.push(zeroAsFlt);
cache.push(oneAsFlt);
