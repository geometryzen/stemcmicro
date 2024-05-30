import { create_flt, is_flt, zero } from "@stemcmicro/atoms";
import { car, Cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { ARCTANH, TANH } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";

//             exp(2 x) - 1
//  tanh(x) = --------------
//             exp(2 x) + 1
export function eval_tanh(p1: Cons, $: ExtensionEnv): U {
    return tanh($.valueOf(cadr(p1)), $);
}

function tanh(p1: U, $: ExtensionEnv): U {
    if (car(p1).equals(ARCTANH)) {
        return cadr(p1);
    }
    if (is_flt(p1)) {
        let d = Math.tanh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return create_flt(d);
    }
    if ($.iszero(p1)) {
        return zero;
    }
    return items_to_cons(TANH, p1);
}
