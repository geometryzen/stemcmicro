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
 * Rat | i => Rat * i
 */
class Op extends Function2<Rat, BCons<Sym, Rat, Rat>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_rat_imu', MATH_INNER, is_rat, is_imu, $);
    }
    transform2(opr: Sym, lhs: Rat, rhs: BCons<Sym, Rat, Rat>): [TFLAGS, U] {
        return [CHANGED, makeList(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs)];
    }
}

export const inner_2_rat_imu = new Builder();
