import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, MODE_FACTORING, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { Cons1 } from "../helpers/Cons1";
import { MATH_SIN } from "../sin/MATH_SIN";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LLL = Rat;                 // -1
type LLR = Cons1<Sym, U>;       // cos(a)
type LL = Cons2<Sym, LLL, LLR>; // -1 * cos(a)
type LR = Cons1<Sym, U>         // sin(b)
type LHS = Cons2<Sym, LL, LR>   // (-1 * cos(a)) * sin(b)
type RL = Cons1<Sym, U>;        // cos(b)
type RR = Cons1<Sym, U>;        // sin(a)
type RHS = Cons2<Sym, RL, RR>   // cos(b) * sin(a)
type EXP = Cons2<Sym, LHS, RHS>;// cos(b) * sin(a) + (-1 * cos(a)) * sin(b)

const guardLLL = is_rat;
const guardLLR = and(is_cons, is_opr_1_any(MATH_COS));
const guardLL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardLLL, guardLLR));
const guardLR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardLL, guardLR));

const guardRL = and(is_cons, is_opr_1_any(MATH_COS));
const guardRR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardR = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRL, guardRR));

function cross(lhs: LHS, rhs: RHS): boolean {
    const num = lhs.lhs.lhs;
    const a1 = lhs.lhs.rhs.arg;
    const b1 = lhs.rhs.arg;
    const a2 = rhs.rhs.arg;
    const b2 = rhs.lhs.arg;
    return num.isMinusOne() && a1.equals(a2) && b1.equals(b2);
}

/**
 * -cos(a)*sin(b)+cos(b)*sin(a) => sin(a-b)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly phases = MODE_FACTORING;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring', MATH_ADD, guardL, guardR, cross, $);
        // TODO: Notice that the hash isn't very selective.
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        const a = orig.rhs.rhs.arg;
        const b = orig.rhs.lhs.arg;
        const a_minus_b = $.valueOf(items_to_cons(MATH_ADD, a, $.negate(b)));
        const retval = $.valueOf(items_to_cons(MATH_SIN, a_minus_b));
        return [TFLAG_DIFF, retval];
    }
}

export const add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring = new Builder();
