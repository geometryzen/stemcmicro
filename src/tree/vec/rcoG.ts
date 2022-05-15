import { Adapter } from './Adapter';
import { MaskAndWeight, Metric } from './BasisBlade';
import { gpG } from './gpG';
import { grade } from './grade';

export function rcoG<T, K>(a: MaskAndWeight<T>, b: MaskAndWeight<T>, m: Metric<T>, adapter: Adapter<T, K>): MaskAndWeight<T>[] {
    const ga = a.grade();
    const gb = b.grade();
    if (ga < gb) {
        return [];
    }
    else {
        const bitmap = a.bitmap ^ b.bitmap;

        const g = grade(bitmap);

        if (g !== (ga - gb)) {
            return [];
        }
        else {
            return gpG(a, b, m, adapter);
        }
    }
}
