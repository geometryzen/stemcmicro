import { BasisBlade } from "./BasisBlade";

export function is_scalar<T, K>(arg: BasisBlade<T, K>): boolean {
    return arg.bitmap === 0;
}
