
import { is_flt } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_IMU } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { IMU_TYPE, is_imu } from "../imu/is_imu";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Flt;
type RHS = IMU_TYPE;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Flt * Imu
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Imu'];
    constructor($: ExtensionEnv) {
        super('mul_2_flt_imu', MATH_MUL, is_flt, is_imu, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_IMU);
    }
    // TODO
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        if (lhs.isOne()) {
            // Even though one is the identity element for multiplication, we have to keep
            // the factor of 1.0 to know that we are using floats.
            return [TFLAG_NONE, expr];
        }
        return [TFLAG_HALT, expr];
    }
}

export const mul_2_flt_imu = new Builder();
