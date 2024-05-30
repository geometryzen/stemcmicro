import { create_rat, is_flt, is_rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export function isequalq(p: U, a: number, b: number): boolean {
    if (is_rat(p)) {
        return p.equalsRat(create_rat(a, b));
    }

    if (is_flt(p)) {
        return p.d === a / b;
    }

    return false;
}
