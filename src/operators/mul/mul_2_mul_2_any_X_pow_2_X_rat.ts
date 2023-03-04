import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RL = U;
type RR = Rat;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_any_any(MATH_MUL));
const guardR: GUARD<U, RHS> = and(is_cons, is_opr_2_any_rhs(MATH_POW, is_rat));

function cross(lhs: LHS, rhs: RHS): boolean {
    const Y1 = lhs.rhs;
    const Y2 = rhs.lhs;
    return Y1.equals(Y2);
}

/**
 * (X * Y) * (expt Y k) => X * (expt Y k+1) 
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_X_pow_2_X_rat', MATH_MUL, guardL, guardR, cross, $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const Y = lhs.rhs;
        const k = rhs.rhs;
        const p1 = $.valueOf(items_to_cons(rhs.opr, Y, k.succ()));
        const p2 = $.valueOf(items_to_cons(MATH_MUL, X, p1));
        return [TFLAG_DIFF, p2];
    }
}

export const mul_2_mul_2_any_X_pow_2_X_rat = new Builder();
