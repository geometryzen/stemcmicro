import { count_factors } from "../../calculators/count_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_multiply } from "../../runtime/helpers";
import { Flt } from "../../tree/flt/Flt";
import { negOne, one, Rat, zero } from "../../tree/rat/Rat";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { sgn } from "./sgn";

const not_is_flt = (expr: U) => !is_flt(expr);

export function sgn_extension_flt(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(expr.argList.car);
    if (is_flt(arg)) {
        return sgn_of_flt(arg);
    }
    if (is_multiply(arg) && count_factors(arg, is_flt) === 1) {
        const rem = remove_factors(arg, is_flt);
        const rat = assert_flt(remove_factors(arg, not_is_flt));
        const srat = sgn_of_flt(rat);
        const srem = sgn(rem, $);
        return $.multiply(srat, srem);
    }
    return expr;
}

function sgn_of_flt(arg: Flt): Rat {
    if (arg.d > 0) {
        return one;
    }
    if (arg.d === 0) {
        return zero;
    }
    return negOne;
}

function assert_flt(expr: U): Flt {
    if (is_flt(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}
