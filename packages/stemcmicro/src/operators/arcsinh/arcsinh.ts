import { create_flt, is_flt, zero } from "math-expression-atoms";
import { car, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { ARCSINH, SINH } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";

export function eval_arcsinh(x: U, $: ExtensionEnv): U {
    return arcsinh($.valueOf(cadr(x)), $);
}

export function arcsinh(x: U, $: ExtensionEnv): U {
    if (car(x).equals(SINH)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let { d } = x;
        d = Math.log(d + Math.sqrt(d * d + 1.0));
        return create_flt(d);
    }

    if ($.iszero(x)) {
        return zero;
    }

    return items_to_cons(ARCSINH, x);
}
