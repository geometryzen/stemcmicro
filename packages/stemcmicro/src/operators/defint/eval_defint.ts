import { car, cdr, Cons, is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { cadr, cddr } from "../../tree/helpers";
import { integral } from "../integral/integral_helpers";
import { subst } from "../subst/subst";

/* defint =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
f,x,a,b[,y,c,d...]

General description
-------------------
Returns the definite integral of f with respect to x evaluated from "a" to b.
The argument list can be extended for multiple integrals (or "iterated
integrals"), for example a double integral (which can represent for
example a volume under a surface), or a triple integral, etc. For
example, defint(f,x,a,b,y,c,d).

*/
/**
 * Evaluates (defint f x a b [y c d ...])
 * @param expr
 * @param $
 * @returns
 */
export function eval_defint(expr: Cons, $: ExtensionEnv): U {
    let F = $.valueOf(cadr(expr));

    // console.lg(`F=${print_expr(F, $)}`);

    let p1 = cddr(expr);

    // defint can handle multiple
    // integrals, so we loop over the
    // multiple integrals here
    while (is_cons(p1)) {
        const X = $.valueOf(car(p1));
        // console.lg(`X=${print_expr(X, $)}`);
        p1 = cdr(p1);

        const A = $.valueOf(car(p1));
        // console.lg(`A=${print_expr(A, $)}`);
        p1 = cdr(p1);

        const B = $.valueOf(car(p1));
        // console.lg(`B=${print_expr(B, $)}`);
        p1 = cdr(p1);

        // obtain the primitive of F against the
        // specified variable X
        // note that the primitive changes over
        // the calculation of the multiple
        // integrals.
        F = integral(F, X, $); // contains the antiderivative of F

        // console.lg(`F=${print_expr(F, $)}`);

        // evaluate the integral in A
        const arg1 = $.valueOf(subst(F, X, B, $));

        // evaluate the integral in B
        const arg2 = $.valueOf(subst(F, X, A, $));

        // integral between B and A is the
        // subtraction. Note that this could
        // be a number but also a function.
        // and we might have to integrate this
        // number/function again doing the while
        // loop again if this is a multiple
        // integral.
        F = $.subtract(arg1, arg2);
    }
    return F;
}
