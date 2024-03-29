import { compare_U_U } from "../../calculators/compare/compare_U_U";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
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
import { MATH_SIN } from "../sin/MATH_SIN";

type LL = Cons1<Sym, U>;
type LR = Cons1<Sym, U>;
type LHS = Cons2<Sym, LL, LR>
type RL = Cons1<Sym, U>;
type RR = Cons1<Sym, U>;
type RHS = Cons2<Sym, RL, RR>
type EXP = Cons2<Sym, LHS, RHS>;

const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, and(is_cons, is_opr_1_any(MATH_COS)), and(is_cons, is_opr_1_any(MATH_SIN))));
const guardR = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, and(is_cons, is_opr_1_any(MATH_COS)), and(is_cons, is_opr_1_any(MATH_SIN))));

function cross(lhs: LHS, rhs: RHS): boolean {
    const a1 = lhs.rhs.arg;
    const b1 = lhs.lhs.arg;
    const a2 = rhs.lhs.arg;
    const b2 = rhs.rhs.arg;
    return a1.equals(a2) && b1.equals(b2) && compare_U_U(b1, a1) > 0;
}

/**
 * cos(b)*sin(a)+cos(a)*sin(b) => cos(a)*sin(b)+cos(b)*sin(a)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('add_2_mul_2_cos_sin_mul_2_cos_sin_ordering', MATH_ADD, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const swapped = items_to_cons(opr, orig.rhs, orig.lhs);
        const retval = $.valueOf(swapped);
        return [TFLAG_DIFF, retval];
    }
}

export const add_2_mul_2_cos_sin_mul_2_cos_sin_ordering = mkbuilder(Op);
