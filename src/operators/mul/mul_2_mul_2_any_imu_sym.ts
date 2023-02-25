import { ExtensionEnv, Operator, OperatorBuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { IMU_TYPE, is_imu } from "../imu/is_imu";
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
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_any, is_imu));
const guardR = is_sym;

/**
 * (X * i) * a => (X * a) * i
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_imu_sym', MATH_MUL, guardL, guardR, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const i = lhs.rhs;
        const a = rhs;
        switch ($.compareFn(opr)(i, a)) {
            case SIGN_GT: {
                const Xa = $.valueOf(items_to_cons(opr, X, a));
                const Xai = $.valueOf(items_to_cons(MATH_MUL, Xa, i));
                // console.lg(`${this.name} ${print_expr(orig, $)} ==> ${print_expr(Xia, $)}`);
                return [TFLAG_DIFF, Xai];
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_mul_2_any_imu_sym = new Builder();
