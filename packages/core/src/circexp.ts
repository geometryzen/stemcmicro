import { ExtensionEnv } from "./env/ExtensionEnv";
import { imu } from "./env/imu";
import { divide } from "./helpers/divide";
import { expcos } from "./operators/expcos/expcos";
import { expsin } from "./operators/expsin/expsin";
import { is_tensor } from "./operators/tensor/is_tensor";
import { COS, COSH, SIN, SINH, TAN, TANH } from "./runtime/constants";
import { cadr } from "./tree/helpers";
import { half, one, two } from "./tree/rat/Rat";
import { car, Cons, is_cons, U } from "./tree/tree";

/* circexp =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------

Returns expression x with circular and hyperbolic functions converted to exponential forms. Sometimes this will simplify an expression.

*/
export function eval_circexp(expr: Cons, $: ExtensionEnv): U {
    const result = circexp($.valueOf(cadr(expr)), $);
    return $.valueOf(result);
}

export function circexp(expr: U, $: ExtensionEnv): U {
    if (car(expr).equals(COS)) {
        return expcos(cadr(expr), $);
    }

    if (car(expr).equals(SIN)) {
        return expsin(cadr(expr), $);
    }

    if (car(expr).equals(TAN)) {
        const p1 = cadr(expr);
        const p2 = $.exp($.multiply(imu, p1));
        const p3 = $.exp($.negate($.multiply(imu, p1)));

        return divide($.multiply($.subtract(p3, p2), imu), $.add(p2, p3), $);
    }

    if (car(expr).equals(COSH)) {
        const p1 = cadr(expr);
        return $.multiply($.add($.exp(p1), $.exp($.negate(p1))), half);
    }

    if (car(expr).equals(SINH)) {
        const p1 = cadr(expr);
        return $.multiply($.subtract($.exp(p1), $.exp($.negate(p1))), half);
    }

    if (car(expr).equals(TANH)) {
        const p1 = $.exp($.multiply(cadr(expr), two));
        return divide($.subtract(p1, one), $.add(p1, one), $);
    }

    if (is_cons(expr)) {
        return expr.map(function (x) {
            return circexp(x, $);
        });
    }

    if (is_tensor(expr)) {
        const elems = expr.mapElements(function (x) {
            return circexp(x, $);
        });
        return expr.withElements(elems);
    }

    return expr;
}
