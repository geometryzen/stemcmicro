import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { IMU_TYPE, is_imu } from "../imu/is_imu";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = IMU_TYPE;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Rat | i => Rat * i
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('inner_2_rat_imu', MATH_INNER, is_rat, is_imu, $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs)];
    }
}

export const inner_2_rat_imu = new Builder();
