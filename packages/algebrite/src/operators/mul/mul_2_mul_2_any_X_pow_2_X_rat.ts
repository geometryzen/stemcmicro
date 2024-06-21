import { Rat } from "@stemcmicro/atoms";
import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "@stemcmicro/hashing";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";
import { is_rat } from "../rat/is_rat";

type LL = U;
type LR = U;
type LHS = Cons2<Sym, LL, LR>;
type RL = U;
type RR = Rat;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_any_any(MATH_MUL));
const guardR: GUARD<U, RHS> = and(is_cons, is_opr_2_any_rhs(MATH_POW, is_rat));

function cross(lhs: LHS, rhs: RHS): boolean {
    const Y1 = lhs.rhs;
    const Y2 = rhs.lhs;
    return Y1.equals(Y2);
}

/**
 * (X * Y) * (pow Y k) => X * (pow Y k+1)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_mul_2_any_X_pow_2_X_rat", MATH_MUL, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const X = lhs.lhs;
        const Y = lhs.rhs;
        const k = rhs.rhs;
        const p1 = $.valueOf(items_to_cons(rhs.opr, Y, k.succ()));
        const p2 = $.valueOf(items_to_cons(MATH_MUL, X, p1));
        return [TFLAG_DIFF, p2];
    }
}

export const mul_2_mul_2_any_X_pow_2_X_rat = mkbuilder<EXP>(Op);
