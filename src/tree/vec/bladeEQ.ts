import { Adapter } from './Adapter';
import { BasisBlade } from './BasisBlade';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function bladeEQ<T, K>(lhs: BasisBlade<T, K>, rhs: BasisBlade<T, K>, field: Adapter<T, K>): boolean {
    if (lhs.bitmap !== rhs.bitmap) {
        return false;
    }
    return true;
}
