import { create_int, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { add } from "./helpers/add";
import { divide } from "./helpers/divide";
import { multiply } from "./helpers/multiply";
import { power } from "./helpers/power";
import { subtract } from "./helpers/subtract";
import { coefficients } from "./operators/coeff/coeff";
import { SYMBOL_X } from "./runtime/constants";

/**
 * (quotient p q x)
 *
 * @returns the quotient of the polynomial p(x) over q(x).
 *
 * The remainder can be calculated by p - q * quotient(p,q)
 */
export function eval_quotient(expr: Cons, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    const p = $.valueOf(expr.item1);
    const q = $.valueOf(expr.item2);
    const X = $.valueOf(expr.item3);
    if (!X.isnil) {
        return quotient(p, q, X, $);
    } else {
        return quotient(p, q, SYMBOL_X, $);
    }
}

export function quotient(p: U, q: U, X: U, _: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    const dividendCs = coefficients(p, X, _);
    let m = dividendCs.length - 1; // m is dividend's highest power

    const divisorCs = coefficients(q, X, _);
    const n = divisorCs.length - 1; // n is divisor's highest power

    let x = m - n;

    let retval: U = zero;
    while (x >= 0) {
        const Q = divide(dividendCs[m], divisorCs[n], _);

        for (let i = 0; i <= n; i++) {
            dividendCs[x + i] = subtract(_, dividendCs[x + i], multiply(_, divisorCs[i], Q));
        }

        retval = add(_, retval, multiply(_, Q, power(_, X, create_int(x))));

        m--;
        x--;
    }

    return retval;
}
