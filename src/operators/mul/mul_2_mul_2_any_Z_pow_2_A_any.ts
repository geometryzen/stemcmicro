import { compare_factors } from "../../calculators/compare/compare_factors";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RL = U;
type RR = U;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_any_any(MATH_MUL));
const guardR: GUARD<U, RHS> = and(is_cons, is_opr_2_any_any(MATH_POW));

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const Z = lhs.rhs;
        const A = rhs.lhs;
        return is_sym(Z) && is_sym(A) && compare_factors(Z, A, $) > 0;
    };
}

/**
 * This fails for the example X = 2, Z = (power x 2), A = x, Y = -1
 * Perhaps restrict Z and A to being symbols?
 * (X * Z) * (power A Y) => (X * (power A Y)) * Z  
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_Z_pow_2_A_any', MATH_MUL, guardL, guardR, cross($), $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const Z = lhs.rhs;
        const A = rhs.lhs;
        const Y = rhs.rhs;
        const p1 = items_to_cons(rhs.opr, A, Y);
        const p2 = $.valueOf(p1);
        const p3 = items_to_cons(lhs.opr, X, p2);
        const p4 = $.valueOf(p3);
        const p5 = items_to_cons(opr, p4, Z);
        const p6 = $.valueOf(p5);
        return [TFLAG_DIFF, p6];
    }
}

export const mul_2_mul_2_any_Z_pow_2_A_any = new Builder();
