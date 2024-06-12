import { is_rat } from "@stemcmicro/atoms";
import { is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { car, cdr, Cons, is_cons } from "@stemcmicro/tree";

/**
 * @param p is a multiplicative expression.
 */
export function find_denominator(p: Cons): 0 | 1 {
    p = p.argList;
    while (is_cons(p)) {
        const q = car(p);
        if (is_cons(q) && is_cons_opr_eq_power(q)) {
            const expo = q.expo;
            if (is_rat(expo) && expo.isNegative()) {
                return 1;
            }
        }
        p = cdr(p);
    }
    return 0;
}
