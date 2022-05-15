import { is_zero_sum } from "../../calculators/factorize/is_zero_sum";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
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

function cross(lhs: LHS, rhs: RHS): boolean {
    return lhs.equals(rhs);
}

/**
 * transform(X + Y) => transform(X) + transform(Y)
 * 
 * As a special case, when X an Y are equal,
 * 
 * X + X => 2 * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_any_any', MATH_ADD, is_any, is_any, $);
        this.hash = '(+ U U)';
    }
    isZero(expr: EXP): boolean {
        // The answer will almost certainly be false if the transformer to remove such cancellations is installed.
        return is_zero_sum(expr.lhs, expr.rhs, this.$);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (cross(lhs, rhs)) {
            // X + X => 2 * X
            // This is probably dead code now due to the factorize RHS version.
            return [CHANGED, this.$.valueOf(makeList(MATH_MUL, two, lhs))];
        }
        else {
            // transform(X + Y) => transform(X) + transform(Y) (from base class).
            return [NOFLAGS, expr];
        }
    }
}

export const add_2_any_any = new Builder();
