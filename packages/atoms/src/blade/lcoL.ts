import { Adapter } from "./Adapter";
import { MaskAndWeight } from "./BasisBlade";
import { create_zero_mask_and_weight } from "./create_mask_and_weight";
import { gpL } from "./gpL";
import { grade } from "./grade";

/**
 * Computes the left contraction when the metric is diagonal.
 * @param a
 * @param b
 * @param m
 * @param adapter
 * @returns a << b under a diagonal metric.
 */
export function lcoL<T, K>(a: MaskAndWeight<T>, b: MaskAndWeight<T>, m: T[], adapter: Adapter<T, K>): MaskAndWeight<T> {
    const ga = a.grade();
    const gb = b.grade();
    if (ga > gb) {
        return create_zero_mask_and_weight(adapter);
    } else {
        const bitmap = a.bitmap ^ b.bitmap;

        const g = grade(bitmap);

        if (g !== gb - ga) {
            return create_zero_mask_and_weight(adapter);
        } else {
            return gpL(a, b, m, adapter);
        }
    }
}
