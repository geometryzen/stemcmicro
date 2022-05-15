import { Adapter } from './Adapter';
import { MaskAndWeight, Metric } from './BasisBlade';
import { gpL } from './gpL';
import { combine_mask_and_weights } from './combine_mask_and_weights';

/**
 * Computes the geometric product of blades when the metric is general.
 * @param a The mask for the blade.
 * @param b The mask for the blade.
 * @param metric 
 * @param adapter 
 * @returns 
 */
export function gpG<T, K>(a: MaskAndWeight<T>, b: MaskAndWeight<T>, metric: Metric<T>, adapter: Adapter<T, K>): MaskAndWeight<T>[] {

    const A = metric.toEigenBasis(a);
    const B = metric.toEigenBasis(b);
    const M = metric.getEigenMetric();

    const rez: MaskAndWeight<T>[] = [];

    for (let i = 0; i < A.length; i++) {
        for (let k = 0; k < B.length; k++) {
            A[i].bitmap;
            A[i].weight;
            rez.push(gpL(A[i], B[k], M, adapter));
        }
    }

    return metric.toMetricBasis(combine_mask_and_weights(rez, adapter));
}
