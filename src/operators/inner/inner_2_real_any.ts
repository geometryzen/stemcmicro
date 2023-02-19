import { ExtensionEnv, Operator, OperatorBuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function is_real($: ExtensionEnv) {
    return function (expr: LHS): expr is U {
        if ($.isOne(expr)) {
            return false;
        }
        const retval = $.isReal(expr);
        return retval;
    };
}

/**
 * X | Y => X * (1 | Y), when X is real.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('inner_2_real_any', MATH_INNER, is_real($), is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const A = $.valueOf(items_to_cons(opr, one, rhs));
        const B = $.valueOf(items_to_cons(MATH_MUL, lhs, A));
        return [TFLAG_DIFF, B];
    }
}

export const inner_2_real_any = new Builder();
