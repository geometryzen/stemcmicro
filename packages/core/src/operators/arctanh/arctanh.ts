import { is_flt, zero } from "@stemcmicro/atoms";
import { car, Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { items_to_cons } from "../../makeList";
import { ARCTANH, TANH } from "../../runtime/constants";
import { create_flt } from "../../tree/flt/Flt";
import { cadr } from "../../tree/helpers";

export function eval_arctanh(x: Cons, $: ExtensionEnv): U {
    return arctanh($.valueOf(cadr(x)), $);
}

function arctanh(x: U, $: ExtensionEnv): U {
    if (car(x).equals(TANH)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let { d } = x;
        if (d < -1.0 || d > 1.0) {
            throw new Error("arctanh function argument is not in the interval [-1,1]");
        }
        d = Math.log((1.0 + d) / (1.0 - d)) / 2.0;
        return create_flt(d);
    }

    if ($.iszero(x)) {
        return zero;
    }

    return items_to_cons(ARCTANH, x);
}
