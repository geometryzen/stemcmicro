import { Rat } from "@stemcmicro/atoms";
import { hash_binop_cons_cons } from "@stemcmicro/hashing";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, MODE_FACTORING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { Cons1 } from "../helpers/Cons1";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_rat } from "../rat/is_rat";
import { MATH_SIN } from "../sin/MATH_SIN";

type LL = Cons1<Sym, U>; // cos(a)
type LR = Cons1<Sym, U>; // sin(b)
type LHS = Cons2<Sym, LL, LR>; // cos(a) * sin(b)
type RLL = Rat; // -1
type RLR = Cons1<Sym, U>; // sin(a)
type RL = Cons2<Sym, RLL, RLR>; // -1 * sin(a)
type RR = Cons1<Sym, U>; // cos(b)
type RHS = Cons2<Sym, RL, RR>; // -1 * sin(a) * cos(b)
type EXP = Cons2<Sym, LHS, RHS>; // cos(a) * sin(b) - sin(a) * cos(b)

const guardLL = and(is_cons, is_opr_1_any(MATH_COS));
const guardLR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardLL, guardLR));
const guardRLL = is_rat;
const guardRLR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardRL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRLL, guardRLR));
const guardRR = and(is_cons, is_opr_1_any(MATH_COS));
const guardR = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRL, guardRR));

function cross(lhs: LHS, rhs: RHS): boolean {
    const a1 = lhs.lhs.arg;
    const b1 = lhs.rhs.arg;
    const num = rhs.lhs.lhs;
    const a2 = rhs.lhs.rhs.arg;
    const b2 = rhs.rhs.arg;
    return num.isMinusOne() && a1.equals(a2) && b1.equals(b2);
}

/**
 * cos(a)*sin(b)-sin(a)*cos(b) => sin(b-a)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    readonly phases = MODE_FACTORING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos", MATH_ADD, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const a = orig.lhs.lhs.arg;
        const b = orig.lhs.rhs.arg;
        const b_minus_a = $.valueOf(items_to_cons(MATH_ADD, b, $.negate(a)));
        const sin = $.valueOf(items_to_cons(MATH_SIN, b_minus_a));
        return [TFLAG_DIFF, sin];
    }
}

export const add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos = mkbuilder(Op);
