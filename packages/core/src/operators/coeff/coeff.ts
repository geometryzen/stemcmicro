import { one, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Cons, is_cons, nil, U } from "@stemcmicro/tree";
import { subtract } from "../../calculators/sub/subtract";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Vector } from "../../env/Vector";
import { filter } from "../../filter";
import { divide, divide_expand } from "../../helpers/divide";
import { SYMBOL_X } from "../../runtime/constants";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { subst } from "../subst/subst";

/**
 * (coeff p x n)
 *
 * Returns the coefficient of x^n in polynomial p. The x argument can be omitted for polynomials in x.
 */
export function eval_coeff(expr: Cons, $: ExtensionEnv): U {
    const p = $.valueOf(expr.item1);
    let x = $.valueOf(expr.item2);
    let n = $.valueOf(expr.item3);

    if (nil.equals(n)) {
        // only 2 args?
        n = x;
        x = SYMBOL_X;
    }

    // divide p by x^n, keep the constant term (the term not containing x)
    const x_pow_n = $.power(x, n);
    const p_div_x_pow_n = divide(p, x_pow_n, $);
    const k = filter(p_div_x_pow_n, x, $);
    return k;
}

//-----------------------------------------------------------------------------
//
//  Get polynomial coefficients
//
//  Input:  p(x) (the polynomial)
//
//          x (the variable)
//
//  Output:    Returns the array of coefficients:
//
//      [Coefficient of x^0, ..., Coefficient of x^(n-1)]
//
//-----------------------------------------------------------------------------

/**
 * The coefficients of the polynomial expression are returned in an array in the order [a0, a1, a2, ..., an].
 *
 * There are no gaps.
 */
export function coefficients(expr: U, x: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U[], description: string): U[] {
        return retval;
    };

    const coefficients = new Vector();

    let p = expr;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const c = $.valueOf(subst(p, x, zero, $));
        coefficients.push(c);

        if (p.equals(c)) {
            // Optimization is if p == c then result is zero.
            p = zero;
        } else {
            p = $.valueOf(subtract(p, c, $));
        }

        if (p.equals(zero)) {
            // This appears to be the only way we get out of the loop.
            try {
                return hook(coefficients.elements, "A");
            } finally {
                coefficients.release();
            }
        }

        // We should get the same result through division, although I would be concerned that
        // x/x depends upon whether x is non-zero. In future, our analysis may reflect that by
        // returning a conditioned expression. We may even try to do better than this by seeing if
        // p has the factor x on the right (in some form or other).
        // Certainly, this shortcut avoids a lot of computation of coefficients etc.
        if (p.equals(x)) {
            p = one;
        } else if (is_cons(p) && is_mul_2_any_any_and_rhs_equals(p, x)) {
            p = p.lhs;
        } else {
            p = divide_expand(p, x, $);
            p = $.valueOf(p);
        }
    }
}

export function is_mul_2_any_any_and_rhs_equals(expr: Cons, x: U): boolean {
    if (is_mul_2_any_any(expr)) {
        return expr.rhs.equals(x);
    } else {
        return false;
    }
}
