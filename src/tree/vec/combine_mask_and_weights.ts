import { Adapter } from './Adapter';
import { create_mask_and_weight } from './create_mask_and_weight';
import { bladesToArray } from './bladesToArray';
import { MaskAndWeight } from './BasisBlade';

export function combine_mask_and_weights<T, K>(blades: MaskAndWeight<T>[], adapter: Adapter<T, K>): MaskAndWeight<T>[] {
    const map: { [bitmap: number]: MaskAndWeight<T> } = {};
    for (let i = 0; i < blades.length; i++) {
        const B = blades[i];
        const existing = map[B.bitmap];
        if (existing) {
            const scale = adapter.add(existing.weight, B.weight);
            if (adapter.isZero(scale)) {
                delete map[B.bitmap];
            }
            else {
                map[B.bitmap] = create_mask_and_weight(B.bitmap, scale, adapter);
            }
        }
        else {
            if (!adapter.isZero(B.weight)) {
                map[B.bitmap] = B;
            }
        }
    }
    return bladesToArray(map);
}
