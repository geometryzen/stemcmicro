import { is_rat, one, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { cadr, Cons, U } from "@stemcmicro/tree";

export function eval_isprime(expr: Cons, $: ExprContext): U {
    return isprime($.valueOf(cadr(expr)));
}

function isprime(x: U): U {
    if (is_rat(x) && x.isNonNegativeInteger() && x.a.isProbablePrime()) {
        return one;
    }
    return zero;
}
