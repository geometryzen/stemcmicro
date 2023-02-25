import { ExtensionEnv, Operator, OperatorBuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_IMU } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { IMU_TYPE, is_imu } from "../imu/is_imu";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Sym;
type LHS = BCons<Sym, LL, LR>;
type RHS = IMU_TYPE;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (X * a) * i => (X * i) * a or (X * a) * i, consistent with compare_factors
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_imu', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_imu, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_IMU);
    }
    isImag(expr: EXP): boolean {
        const $ = this.$;
        const X = expr.lhs.lhs;
        return $.isReal(X);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const a = lhs.rhs;
        const i = rhs;
        switch ($.getSymbolOrder(opr).compare(a, i, $)) {
            case SIGN_GT: {
                const Xi = $.valueOf(items_to_cons(MATH_MUL, X, i));
                const Xia = $.valueOf(items_to_cons(MATH_MUL, Xi, a));
                return [TFLAG_DIFF, Xia];
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_mul_2_any_sym_imu = new Builder();
