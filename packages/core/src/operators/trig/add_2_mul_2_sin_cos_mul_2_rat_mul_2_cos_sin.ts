import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, MODE_FACTORING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
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

type LL = Cons1<Sym, U>;
type LR = Cons1<Sym, U>;
type LHS = Cons2<Sym, LL, LR>;
type RL = Rat;
type RRL = Cons1<Sym, U>;
type RRR = Cons1<Sym, U>;
type RR = Cons2<Sym, RRL, RRR>;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

const guardLL = and(is_cons, is_opr_1_any(MATH_SIN));
const guardLR = and(is_cons, is_opr_1_any(MATH_COS));
const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardLL, guardLR));
const guardRRL = and(is_cons, is_opr_1_any(MATH_COS));
const guardRRR = and(is_cons, is_opr_1_any(MATH_SIN));
const guardRR = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRRL, guardRRR));
const guardRL = is_rat;
const guardR = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardRL, guardRR));

function cross(lhs: LHS, rhs: RHS): boolean {
    const a1 = lhs.lhs.arg;
    const b1 = lhs.rhs.arg;
    const num = rhs.lhs;
    const a2 = rhs.rhs.lhs.arg;
    const b2 = rhs.rhs.rhs.arg;
    return num.isMinusOne() && a1.equals(a2) && b1.equals(b2);
}

/**
 * TODO: This is "wrong" because it assumes that the RHS is factorized with cos and sin together.
 * In ordinary left association we would have (-1 * cos(a)) * sin(b)
 *
 * sin(a)*cos(b)+(-1*(cos(a)*sin(b))) => sin(a-b)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    readonly phases = MODE_FACTORING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin", MATH_ADD, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const a = orig.lhs.lhs.arg;
        const b = $.negate(orig.lhs.rhs.arg);
        const a_minus_b = $.valueOf(items_to_cons(MATH_ADD, a, b));
        const sin = $.valueOf(items_to_cons(MATH_SIN, a_minus_b));
        return [TFLAG_DIFF, sin];
    }
}

export const add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin = mkbuilder(Op);
