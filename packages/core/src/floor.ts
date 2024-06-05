import { bigInt, create_flt, is_flt, is_num, is_rat, negOne, Rat } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, is_num_and_negative } from "@stemcmicro/helpers";
import { cadr, items_to_cons, U } from "@stemcmicro/tree";
import { mdiv } from "./mmul";
import { FLOOR } from "./runtime/constants";

export function eval_floor(p1: U, $: ExprContext): U {
    const result = yfloor($.valueOf(cadr(p1)), $);
    return result;
}

function yfloor(p1: U, $: ExprContext): U {
    return yyfloor(p1, $);
}

function yyfloor(x: U, $: ExprContext): U {
    if (!is_num(x)) {
        return items_to_cons(FLOOR, x);
    }

    if (is_flt(x)) {
        return create_flt(Math.floor(x.d));
    }

    if (is_rat(x) && x.isInteger()) {
        return x;
    }

    const p3: U = new Rat(mdiv(x.a, x.b), bigInt.one);

    if (is_num_and_negative(x)) {
        return add($, p3, negOne);
    } else {
        return p3;
    }
}
