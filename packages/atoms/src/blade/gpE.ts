import { Adapter } from "./Adapter";
import { MaskAndWeight } from "./BasisBlade";
import { canonicalReorderingSign } from "./canonicalReorderingSign";
import { create_mask_and_weight } from "./create_mask_and_weight";

/**
 * Computes the geometric product under a Euclidean metric.
 * @param a
 * @param b
 * @param adapter
 * @returns a * b under a Euclidean metric.
 */
export function gpE<T, K>(a: MaskAndWeight<T>, b: MaskAndWeight<T>, adapter: Adapter<T, K>): MaskAndWeight<T> {
    const bitmap = a.bitmap ^ b.bitmap;
    const sign = canonicalReorderingSign(a.bitmap, b.bitmap);
    const scale = adapter.mul(a.weight, b.weight);
    if (sign > 0) {
        return create_mask_and_weight(bitmap, scale, adapter);
    } else {
        return create_mask_and_weight(bitmap, adapter.neg(scale), adapter);
    }
}
