import { compare_factors } from "../../calculators/compare/compare_factors";
import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, SIGN_GT, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { is_imu } from "../../predicates/is_imu";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Sym;
type LHS = BCons<Sym, LL, LR>;
type RHS = BCons<Sym, Rat, Rat>;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (X * a) * i => (X * i) * a or (X * a) * i, consistent with compare_factors
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_imu', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_imu, $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
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
        switch (compare_factors(a, i, $)) {
            case SIGN_GT: {
                const Xi = $.valueOf(makeList(MATH_MUL, X, i));
                const Xia = $.valueOf(makeList(MATH_MUL, Xi, a));
                return [TFLAG_DIFF, Xia];
            }
            default: {
                return [NOFLAGS, orig];
            }
        }
    }
}

export const mul_2_mul_2_any_sym_imu = new Builder();
