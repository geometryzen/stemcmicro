import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_IMU } from "../../hashing/hash_info";
import { IMU_TYPE, is_imu } from "../../predicates/is_imu";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_imu } from "./is_mul_2_any_imu";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = IMU_TYPE;
type LHS = BCons<Sym, LL, LR>;
type RHS = IMU_TYPE;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (X * i) * i = -1 * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_imu_imu', MATH_MUL, and(is_cons, is_mul_2_any_imu), is_imu, $);
        // TODO: We have to know here that the imaginary unit is built from MATH_POW.
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_IMU);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const X = lhs.lhs;
        return [TFLAG_DIFF, makeList(MATH_MUL, negOne, X)];
    }
}

export const mul_2_mul_2_any_imu_imu = new Builder();
