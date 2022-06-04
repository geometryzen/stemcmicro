import { compare_factors } from "../../calculators/compare/compare_factors";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { IMU_TYPE, is_imu } from "../imu/is_imu";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = IMU_TYPE;
type LHS = BCons<Sym, LL, LR>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_any, is_imu));
const guardR = is_any;

/**
 * (X * i) * Y => (X * Y) * i
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Imu'];
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_imu_any', MATH_MUL, guardL, guardR, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const i = lhs.rhs;
        const Y = rhs;
        switch (compare_factors(i, Y, $)) {
            case SIGN_GT: {
                const XY = $.valueOf(items_to_cons(opr, X, Y));
                const XYi = $.valueOf(items_to_cons(MATH_MUL, XY, i));
                return [TFLAG_DIFF, XYi];
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_mul_2_any_imu_any = new Builder();
