import { Adapter } from './Adapter';
import { MaskAndWeight } from './BasisBlade';
import { create_mask_and_weight } from './create_mask_and_weight';
import { gpE } from './gpE';

/**
 * Computes the geometric product of blades when the metric is diagonal.
 * @param a The mask
 * @param b The mask
 * @param m 
 * @param adapter
 */
export function gpL<T, K>(a: MaskAndWeight<T>, b: MaskAndWeight<T>, m: T[], adapter: Adapter<T, K>): MaskAndWeight<T> {

    const temp = gpE(a, b, adapter);

    let weight = temp.weight;

    // compute the meet (bitmap of annihilated vectors):
    let bitmap = a.bitmap & b.bitmap;

    // change the scale according to the metric.
    let i = 0;
    while (bitmap !== 0) {
        if ((bitmap & 1) !== 0) {
            weight = adapter.mul(weight, m[i]);
        }
        i++;
        bitmap = bitmap >> 1;
    }
    return create_mask_and_weight(temp.bitmap, weight, adapter);
}
