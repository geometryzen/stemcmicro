import { Adapter } from './Adapter';
import { is_scalar } from './isScalar';
import { BasisBlade } from './BasisBlade';

export function bladeGT<T, K>(lhs: BasisBlade<T, K>, rhs: BasisBlade<T, K>, field: Adapter<T, K>): boolean {
    if (is_scalar(lhs) && is_scalar(rhs)) {
        const l = lhs.scalarCoordinate();
        const r = rhs.scalarCoordinate();
        return field.gt(l, r);
    }
    else {
        throw new Error(`${lhs} > ${rhs} is not implemented.`);
    }
}
