import { count_factors } from "../../calculators/count_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { mmul } from "../../mmul";
import { is_multiply } from "../../runtime/helpers";
import { negOne, one, Rat, zero } from "../../tree/rat/Rat";
import { Cons, U } from "../../tree/tree";
import { is_rat } from "../rat/is_rat";
import { sgn } from "./sgn";

const not_is_rat = (expr: U) => !is_rat(expr);

export function sgn_extension_rat(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(expr.argList.car);
    if (is_rat(arg)) {
        return sgn_of_rat(arg);
    }
    if (is_multiply(arg) && count_factors(arg, is_rat) === 1) {
        const rem = remove_factors(arg, is_rat);
        const rat = assert_rat(remove_factors(arg, not_is_rat));
        const srat = sgn_of_rat(rat);
        const srem = sgn(rem, $);
        return $.multiply(srat, srem);
    }
    return expr;
}

function sgn_of_rat(arg: Rat): Rat {
    const ab = mmul(arg.a, arg.b);
    if (ab.isNegative()) {
        return negOne;
    }
    if (ab.isZero()) {
        return zero;
    }
    return one;
}

function assert_rat(expr: U): Rat {
    if (is_rat(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}
