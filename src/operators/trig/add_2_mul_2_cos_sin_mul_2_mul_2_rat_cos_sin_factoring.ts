import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, PHASE_FACTORING, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { UCons } from "../helpers/UCons";
import { MATH_SIN } from "../sin/MATH_SIN";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = UCons<Sym, U>;        // cos(b)
type LR = UCons<Sym, U>;        // sin(a)
type LHS = BCons<Sym, LL, LR>   // cos(b) * sin(a)
type RLL = Rat;                 // -1
type RLR = UCons<Sym, U>;       // cos(a)
type RL = BCons<Sym, RLL, RLR>; // -1 * cos(a)
type RR = UCons<Sym, U>         // sin(b)
type RHS = BCons<Sym, RL, RR>   // (-1 * cos(a)) * sin(b)
type EXP = BCons<Sym, LHS, RHS>;// cos(b) * sin(a) + (-1 * cos(a)) * sin(b)

const guardLL = and(is_cons, is_opr_1_any(MATH_COS));
const guardLR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardLL, guardLR));
const guardRLL = is_rat;
const guardRLR = and(is_cons, is_opr_1_any(MATH_COS));
const guardRL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRLL, guardRLR));
const guardRR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardR = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRL, guardRR));

function cross(lhs: LHS, rhs: RHS): boolean {
    const b1 = lhs.lhs.arg;
    const a1 = lhs.rhs.arg;
    const num = rhs.lhs.lhs;
    const a2 = rhs.lhs.rhs.arg;
    const b2 = rhs.rhs.arg;
    return num.isMinusOne() && a1.equals(a2) && b1.equals(b2);
}

/**
 * cos(b)*sin(a)-cos(a)*sin(b) => sin(a-b)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FACTORING;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring', MATH_ADD, guardL, guardR, cross, $);
        // TODO: Notice that the hash isn't very selective.
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        const a = orig.lhs.rhs.arg;
        const b = orig.lhs.lhs.arg;
        const a_minus_b = $.valueOf(makeList(MATH_ADD, a, $.negate(b)));
        const retval = $.valueOf(makeList(MATH_SIN, a_minus_b));
        return [TFLAG_DIFF, retval];
    }
}

export const add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring = new Builder();
