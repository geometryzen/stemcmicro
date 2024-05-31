import { is_flt, is_rat, one, zero } from "@stemcmicro/atoms";
import { is_power } from "@stemcmicro/predicates";
import { Cons, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { is_negative } from "./predicates/is_negative";
import { DIRAC } from "./runtime/constants";
import { is_add } from "./runtime/helpers";
import { cadr } from "./tree/helpers";

export function eval_dirac(expr: Cons, $: ExtensionEnv): U {
    return dirac($.valueOf(cadr(expr)), $);
}

export function dirac(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        if ($.iszero(p1)) {
            return one;
        }
        return zero;
    }

    if (is_rat(p1)) {
        if ($.iszero(p1)) {
            return one;
        }
        return zero;
    }

    if (is_power(p1)) {
        return items_to_cons(DIRAC, p1.base);
    }

    if (is_negative(p1)) {
        return items_to_cons(DIRAC, $.negate(p1));
    }

    if (is_negative(p1) || (is_cons(p1) && is_add(p1) && is_negative(cadr(p1)))) {
        p1 = $.negate(p1);
    }

    return items_to_cons(DIRAC, p1);
}
