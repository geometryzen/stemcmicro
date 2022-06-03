import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { IMU_TYPE, is_imu } from "../../predicates/is_imu";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { binswap } from "../helpers/binswap";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = IMU_TYPE;
type LHS = BCons<Sym, LL, LR>;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (y * i) + x => x + (y * i)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_any_imu_sym', MATH_ADD, and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_any, is_imu)), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        return [TFLAG_DIFF, binswap(orig)];
    }
}

export const add_2_mul_2_any_imu_sym = new Builder();
