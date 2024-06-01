import { is_rat, is_sym } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";
import { car, cdr, Cons, is_cons } from "@stemcmicro/tree";
import { isnegativenumber } from "./isnegativenumber";

/**
 *
 * @param p is a multiplicative expression.
 * @returns
 */
export function find_denominator(p: Cons): 0 | 1 {
    p = p.argList;
    while (is_cons(p)) {
        const q = car(p);
        if (is_cons(q) && is_sym(q.opr) && is_native(q.opr, Native.pow)) {
            const expo = q.expo;
            if (is_rat(expo) && isnegativenumber(expo)) {
                return 1;
            }
        }
        p = cdr(p);
    }
    return 0;
}
