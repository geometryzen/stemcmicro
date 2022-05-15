import { Adapter } from './Adapter';
import { MaskAndWeight } from './BasisBlade';
import { create_zero_mask_and_weight } from './create_mask_and_weight';
import { gpE } from './gpE';
import { grade } from './grade';

export function lcoE<T, K>(a: MaskAndWeight<T>, b: MaskAndWeight<T>, adapter: Adapter<T, K>): MaskAndWeight<T> {
    const ga = a.grade();
    const gb = b.grade();
    if (ga > gb) {
        return create_zero_mask_and_weight(adapter);
    }
    else {
        const bitmap = a.bitmap ^ b.bitmap;

        const g = grade(bitmap);

        if (g !== (gb - ga)) {
            return create_zero_mask_and_weight(adapter);
        }
        else {
            return gpE(a, b, adapter);
        }
    }
}
