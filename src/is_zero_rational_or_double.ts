// this routine is a simple check on whether we have
// a basic zero in our hands. It doesn't perform any

import { is_flt } from "./operators/flt/is_flt";
import { Num } from "./tree/num/Num";
import { is_rat } from "./operators/rat/is_rat";
import { U } from "./tree/tree";

/**
 * Determines whether x is zero, if the value is a rational or double.
 * Otherwise, returns false.
 * @param x The value being tested.
 */
export function is_zero_num(x: U): x is Num & { isZero: true } {
    if (is_rat(x)) {
        return x.isZero();
    }
    else if (is_flt(x)) {
        return x.isZero();
    }
    else {
        return false;
    }
}
