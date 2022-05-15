import { ExtensionEnv } from './env/ExtensionEnv';
import { integral } from './integral';
import { stack_push } from './runtime/stack';
import { subst } from './subst';
import { cadr, cddr } from './tree/helpers';
import { car, cdr, is_cons, U } from './tree/tree';

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
export function Eval_defint(p1: U, $: ExtensionEnv): void {
    let F = $.valueOf(cadr(p1));

    p1 = cddr(p1);

    // defint can handle multiple
    // integrals, so we loop over the
    // multiple integrals here
    while (is_cons(p1)) {
        const X = $.valueOf(car(p1));
        p1 = cdr(p1);

        const A = $.valueOf(car(p1));
        p1 = cdr(p1);

        const B = $.valueOf(car(p1));
        p1 = cdr(p1);

        // obtain the primitive of F against the
        // specified variable X
        // note that the primitive changes over
        // the calculation of the multiple
        // integrals.
        F = integral(F, X, $); // contains the antiderivative of F

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

    stack_push(F);
}
