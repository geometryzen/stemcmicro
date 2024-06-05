import { Err, is_flt, is_num, is_rat, negOne, Num } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { U } from "@stemcmicro/tree";
import { power } from "./ctors/power";

/**
 * inverse(arg) => (valueOf (power arg -1))
 */
export function inverse(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const value = env.valueOf(arg);
    try {
        if (is_num(value)) {
            return invert_number(value);
        } else {
            return power(env, value, negOne);
        }
    } finally {
        value.release();
    }
}

function invert_number(num: Num): Num | Err {
    if (num.isZero()) {
        return diagnostic(Diagnostics.Division_by_zero);
    }

    if (is_flt(num)) {
        return num.inv();
    }

    if (is_rat(num)) {
        return num.inv();
    }

    throw new Error();
}
