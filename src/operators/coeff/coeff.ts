import { subtract } from '../../calculators/sub/subtract';
import { divide_expand } from '../../divide';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { filter } from '../../filter';
import { SYMBOL_X } from '../../runtime/constants';
import { subst } from '../subst/subst';
import { cadddr, caddr, cadr } from '../../tree/helpers';
import { one, zero } from '../../tree/rat/Rat';
import { Cons, is_cons, NIL, U } from '../../tree/tree';
import { is_mul_2_any_any } from '../mul/is_mul_2_any_any';

/* coeff =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
p,x,n

General description
-------------------
Returns the coefficient of x^n in polynomial p. The x argument can be omitted for polynomials in x.

*/
export function Eval_coeff(p1: U, $: ExtensionEnv): U {
    const p = $.valueOf(cadr(p1));
    let x = $.valueOf(caddr(p1));
    let n = $.valueOf(cadddr(p1));

    if (NIL.equals(n)) {
        // only 2 args?
        n = x;
        x = SYMBOL_X;
    }

    // divide p by x^n, keep the constant term (the term not containing x)
    const x_pow_n = $.power(x, n);
    const p_div_x_pow_n = $.divide(p, x_pow_n);
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
 * Used by bake, factorpoly, nroots, quotient, roots.
 * TODO: is it used by Eval_coeff?
 * @param expr 
 * @param x 
 * @param $ 
 * @returns 
 */
export function coeff(expr: U, x: U, $: ExtensionEnv): U[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U[], description: string): U[] {
        return retval;
    };

    const coefficients = [];

    let p = expr;
    // We get a coefficient from each iteration of the loop.
    const MAX_LOOPS = 10;
    let loops = 0;
    // TODO: Replace by recursive function?
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // console.lg();
        // console.lg(`P(${x}) => ${print_expr(p, $)}`);
        // console.lg(`P(${x}) => ${print_list(p, $)}`);
        const p0 = subst(p, x, zero, $);
        const c = $.valueOf(p0);
        // console.lg(`c = P(${x}=0) => ${print_expr(c, $)}`);
        coefficients.push(c);

        // console.lg(`subtracting ${print_list(c, $)} from ${print_list(p, $)}`);

        // TODO: Optimization is if p == c then result is zero.

        if (p.equals(c)) {
            p = zero;
        }
        else {
            p = $.valueOf(subtract(p, c, $));
        }

        // console.lg(`P(${x})-${print_expr(c, $)} = ${print_list(p, $)}`);

        if (p.equals(zero)) {
            // This appears to be the only way we get out of the loop.
            return hook(coefficients, "A");
        }

        // We should get the same result through division, although I would be concerned that
        // x/x depends upon whether x is non-zero. In future, our analysis may reflect that by
        // returning a conditioned expression. We may even try to do better than this by seeing if
        // p has the factor x on the right (in some form or other).
        // Certainly, this shortcut avoids a lot of computation of coefficients etc.
        if (p.equals(x)) {
            p = one;
        }
        else if (is_cons(p) && is_mul_2_any_any_and_rhs_equals(p, x)) {
            p = p.lhs;
        }
        // TODO: Optimize for the case that p is (power x n)
        else {
            // console.lg(`P(${x}) => ${print_expr(p, $)}`);
            p = divide_expand(p, x, $);
            // console.lg(`P(${x})/${x} => ${print_list(p, $)} (divide_expand)`);
            p = $.valueOf(p);
            // console.lg(`P(${x})/${x} => ${print_expr(p, $)} (after value-of)`);
            // throw new Error("ENOUGH!");
            // console.lg(`P(x)/x => ${p}`);
        }
        loops++;
        if (loops > MAX_LOOPS) {
            throw new Error("No making progress computing coefficients.");
        }
    }
}

export function is_mul_2_any_any_and_rhs_equals(expr: Cons, x: U): boolean {
    if (is_mul_2_any_any(expr)) {
        return expr.rhs.equals(x);
    }
    else {
        return false;
    }
}
