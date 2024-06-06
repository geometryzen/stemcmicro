import { create_int, one, zero } from "@stemcmicro/atoms";
import { divide, num_to_number } from "@stemcmicro/helpers";
import { Cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { guess } from "../../guess";
import { TAYLOR } from "../../runtime/constants";
import { derivative } from "../derivative/derivative";
import { factorial } from "../factorial/factorial";
import { subst } from "../subst/subst";

/**
 * (taylor F X N A)
 */
export function eval_taylor(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const F = $.valueOf(expr.item(1));

        const v2 = argList.length >= 2 ? $.valueOf(expr.item(2)) : nil;
        const X = v2.isnil ? guess(F) : v2;

        const v3 = argList.length >= 3 ? $.valueOf(expr.item(3)) : nil;
        const N = v3.isnil ? create_int(24) : v3; // 24: default number of terms

        const v4 = argList.length >= 4 ? $.valueOf(expr.item(4)) : nil;
        const A = v4.isnil ? zero : v4; // 0: default expansion point

        return taylor(F, X, N, A, $);
    } finally {
        argList.release();
    }
}

/**
 * Returns the Taylor expansion of f(x) around x=a. If "a" is omitted then a=0 is used.
 * The argument n is the degree of the expansion.
 *
 * Strictly speaking, Taylor's theorem provides a k-th order Taylor polynomial and a remainder term.
 * This function computes the k-th order Taylor polynomial.
 *
 * @param F the expression being expanded.
 * @param X the variable in the expression.
 * @param N the degree of the expansion.
 * @param A the expansion point.
 */
function taylor(F: U, X: U, N: U, A: U, $: ExtensionEnv): U {
    const k = num_to_number(N);
    if (isNaN(k)) {
        return items_to_cons(TAYLOR, F, X, N, A);
    }

    const x_minus_a = $.subtract(X, A);

    // F contains the i-th derivative of f, initially f.
    let dfi = F;
    // The weight factor in the i-th term is (x-a)**i
    let weight: U = one;
    // retval accumulates the terms in the Taylor polynomial.
    let retval = $.valueOf(subst(dfi, X, A, $)); // The first term in the Taylor polynomial is f(a).
    // Now compute and add the terms that follow up to the required degree.
    for (let i = 1; i <= k; i++) {
        // F now contains the i-th derivative
        dfi = derivative(dfi, X, $); // F: f = f'

        if ($.iszero(dfi)) {
            break;
        }

        // c = c * (x - a)
        weight = $.multiply(weight, x_minus_a);

        const dfi_at_a = $.valueOf(subst(dfi, X, A, $)); // F: f(a)
        const term = divide($.multiply(dfi_at_a, weight), factorial(create_int(i)), $);
        retval = $.add(retval, term);
    }
    return retval;
}
