import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat, two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/RatExtension";
import { is_pow_2_any_rat } from "./is_pow_2_any_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Rat;
type LHS = BCons<Sym, LL, LR>;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_pow_2_any_rat);
const guardR = is_rat;

/**
 * (b**m)**n => b**(m*n), for any positive integers m and n.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('pow_2_pow_2_any_any_any', MATH_POW, guardL, guardR, $);
    }
    isZero(expr: EXP): boolean {
        const b = expr.lhs.lhs;
        return this.$.isZero(b);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const b = lhs.lhs;
        const m = lhs.rhs;
        const n = rhs;
        if (m.isPositiveInteger() && n.isPositiveInteger()) {
            return [CHANGED, makeList(MATH_POW, b, makeList(MATH_MUL, m, n))];
        }
        if (m.isHalf() && n.equalsRat(two)) {
            return [CHANGED, b];
        }
        return [NOFLAGS, expr];
    }
}

export const pow_2_pow_2_any_any_any = new Builder();
