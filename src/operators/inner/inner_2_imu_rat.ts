
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_imu } from "../../predicates/is_imu";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * i | Rat => conj(i) * Rat => -i * Rat
 */
class Op extends Function2<BCons<Sym, Rat, Rat>, Rat> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_imu_rat', MATH_INNER, is_imu, is_rat, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Rat, Rat>, rhs: Rat): [TFLAGS, U] {
        const $ = this.$;
        return [CHANGED, $.negate(makeList(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs))];
    }
}

export const inner_2_imu_rat = new Builder();
