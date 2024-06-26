import { half, negOne, Rat } from "@stemcmicro/atoms";
import { divide, is_negative } from "@stemcmicro/helpers";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { GAMMA, MEQUAL } from "../../runtime/constants";
import { DynamicConstants } from "../../runtime/defs";
import { is_add } from "../../runtime/helpers";
import { cadr } from "../../tree/helpers";
import { car, cdr, items_to_cons, U } from "../../tree/tree";
import { is_rat } from "../rat/is_rat";

export function eval_gamma(p1: U, $: ExtensionEnv): U {
    return gamma($.valueOf(cadr(p1)), $);
}

function gamma(p1: U, $: ExtensionEnv): U {
    return gammaf(p1, $);
}

function gammaf(p1: U, $: ExtensionEnv): U {
    if (is_rat(p1) && MEQUAL(p1.a, 1) && MEQUAL(p1.b, 2)) {
        return $.power(DynamicConstants.PI($), half);
    }

    if (is_rat(p1) && MEQUAL(p1.a, 3) && MEQUAL(p1.b, 2)) {
        return $.multiply($.power(DynamicConstants.PI($), half), half);
    }

    //  if (p1->k == DOUBLE) {
    //    d = exp(lgamma(p1.d))
    //    push_double(d)
    //    return
    //  }

    if (is_negative(p1)) {
        return divide($.multiply(DynamicConstants.PI($), negOne), $.multiply($.multiply($.sin($.multiply(DynamicConstants.PI($), p1)), p1), gamma($.negate(p1), $)), $);
    }

    if (is_add(p1)) {
        return gamma_of_sum(p1, $);
    }

    return items_to_cons(GAMMA, p1);
}

function gamma_of_sum(p1: U, $: ExtensionEnv): U {
    const p3 = cdr(p1);
    if (is_rat(car(p3)) && MEQUAL((car(p3) as Rat).a, 1) && MEQUAL((car(p3) as Rat).b, 1)) {
        return $.multiply(cadr(p3), gamma(cadr(p3), $));
    }

    if (is_rat(car(p3)) && MEQUAL((car(p3) as Rat).a, -1) && MEQUAL((car(p3) as Rat).b, 1)) {
        return divide(gamma(cadr(p3), $), $.add(cadr(p3), negOne), $);
    }

    return items_to_cons(GAMMA, p1);
}
