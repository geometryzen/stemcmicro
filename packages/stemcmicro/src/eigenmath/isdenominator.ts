import { is_num, is_rat, is_sym } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";
import { caddr } from "../tree/helpers";
import { bignum_equal } from "./bignum_equal";
import { isnegativenumber } from "./isnegativenumber";

export function isdenominator(p: U) {
    if (is_cons(p) && is_sym(p.opr) && is_native(p.opr, Native.pow)) {
        const expo = caddr(p);
        if (is_num(expo) && isnegativenumber(expo)) {
            return 1;
        }
    }

    if (is_rat(p) && !bignum_equal(p.b, 1)) {
        return 1;
    }

    return 0;
}
