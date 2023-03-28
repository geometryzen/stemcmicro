import { Adapter } from './Adapter';
import { MaskAndWeight } from './BasisBlade';
import { bitCount } from './bitCount';
import { canonicalReorderingSign } from './canonicalReorderingSign';
import { minusOnePow } from './minusOnePow';

const SCALAR_BITMAP = 0;

export function create_zero_mask_and_weight<T, K>(adapter: Adapter<T, K>): MaskAndWeight<T> {
    return create_mask_and_weight(SCALAR_BITMAP, adapter.zero, adapter);
}

export function create_vector_mask_and_weight<T, K>(bitmap: number, adapter: Adapter<T, K>): MaskAndWeight<T> {
    return create_mask_and_weight(bitmap, adapter.one, adapter);
}

export function create_scalar_mask_and_weight<T, K>(weight: T, adapter: Adapter<T, K>): MaskAndWeight<T> {
    return create_mask_and_weight(SCALAR_BITMAP, weight, adapter);
}
/**
 * 
 * @param b The bitmap representing which blade.
 * @param weight The weight associated with the blade.
 * @param adapter The adapter for the field.
 */
export function create_mask_and_weight<T, K>(b: number, weight: T, adapter: Adapter<T, K>): MaskAndWeight<T> {
    const that: MaskAndWeight<T> = {
        get bitmap(): number {
            return b;
        },
        get weight(): T {
            return weight;
        },
        __neg__(): MaskAndWeight<T> {
            return create_mask_and_weight(b, adapter.neg(weight), adapter);
        },
        __wedge__(rhs: MaskAndWeight<T>): MaskAndWeight<T> {
            // If there are any vectors in common then the result is zero.
            if (b & rhs.bitmap) {
                return create_scalar_mask_and_weight(adapter.zero, adapter);
            }
            else {
                const bitmap = b ^ rhs.bitmap;
                const sign = canonicalReorderingSign(b, rhs.bitmap);
                const newScale = adapter.mul(weight, rhs.weight);
                return create_mask_and_weight(bitmap, sign > 0 ? newScale : adapter.neg(newScale), adapter);
            }
        },
        grade(): number {
            return bitCount(b);
        },
        reverse(): MaskAndWeight<T> {
            const x = that.grade();
            const sign = minusOnePow(x * (x - 1) / 2);
            return create_mask_and_weight(b, sign > 0 ? weight : adapter.neg(weight), adapter);
        },
        gradeInversion(): MaskAndWeight<T> {
            const x = that.grade();
            const sign = minusOnePow(x);
            return create_mask_and_weight(b, sign > 0 ? weight : adapter.neg(weight), adapter);
        },
        cliffordConjugate(): MaskAndWeight<T> {
            const x = that.grade();
            const sign = minusOnePow(x * (x + 1) / 2);
            return create_mask_and_weight(b, sign > 0 ? weight : adapter.neg(weight), adapter);
        },
        zero(): MaskAndWeight<T> {
            return create_scalar_mask_and_weight(adapter.zero, adapter);
        },
        asString(names?: string[]): string {
            let bladePart = "";
            let i = 1;
            let x = b;
            while (x !== 0) {
                if ((x & 1) !== 0) {
                    if (bladePart.length > 0) bladePart += " ^ ";
                    // TODO: redundancy here with isUndefined and the explicit comparison to void 0. TypeScript prefers the latter.
                    // Can isUndefined be better typed? 
                    if (typeof names === 'undefined' || (names === null) || (names === void 0) || (i > names.length) || (names[i - 1] == null)) {
                        bladePart = bladePart + "e" + i;
                    }
                    else {
                        bladePart = bladePart + names[i - 1];
                    }
                }
                x >>= 1;
                i++;
            }
            if (bladePart.length === 0) {
                return adapter.asString(weight);
            }
            else {
                if (adapter.isOne(weight)) {
                    return bladePart;
                }
                else {
                    return adapter.asString(weight) + " * " + bladePart;
                }
            }
        },
        toString(): string {
            return that.asString(void 0);
        }
    };
    return that;
}
