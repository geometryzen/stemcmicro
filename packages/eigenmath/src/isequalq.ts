import { create_rat, is_flt, is_rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export function isequalq(target: U, a: number, b: number): boolean {
    if (is_rat(target)) {
        return target.equalsRat(create_rat(a, b));
    }

    if (is_flt(target)) {
        return target.d === a / b;
    }

    return false;
}
