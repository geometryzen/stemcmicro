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
import { is_sym } from "../sym/is_sym";

type LL = U;
type LR = U;
type LHS = Cons2<Sym, LL, LR>;
type RL = U;
type RR = U;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_any_any(MATH_MUL));
const guardR: GUARD<U, RHS> = and(is_cons, is_opr_2_any_any(MATH_POW));

function cross(lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): boolean {
    const Z = lhs.rhs;
    const A = rhs.lhs;
    return is_sym(Z) && is_sym(A) && $.compareFn(MATH_MUL)(Z, A) > 0;
}

/**
 * This fails for the example X = 2, Z = (pow x 2), A = x, Y = -1
 * Perhaps restrict Z and A to being symbols?
 * (X * Z) * (pow A Y) => (X * (pow A Y)) * Z
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_mul_2_any_Z_pow_2_A_any", MATH_MUL, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
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

export const mul_2_mul_2_any_Z_pow_2_A_any = mkbuilder<EXP>(Op);
