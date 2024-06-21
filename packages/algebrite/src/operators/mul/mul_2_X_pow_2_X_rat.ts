import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "@stemcmicro/hashing";
import { items_to_cons } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_hyp } from "../hyp/is_hyp";
import { is_pow_2_any_rat } from "../pow/is_pow_2_any_rat";
import { is_sym } from "../sym/is_sym";

type LHS = U;
type RL = U;
type RR = Rat;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const X1 = lhs;
    const X2 = rhs.lhs;
    if (is_sym(X1) || is_hyp(X1)) {
        return X1.equals(X2);
    } else {
        return false;
    }
}

/**
 * Looping can occur e.g. X = -1, k = 1/2.
 *
 * X * (X ** k) => X ** (k + 1)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_X_pow_2_X_rat", MATH_MUL, is_any, and(is_cons, is_pow_2_any_rat), cross);
        this.#hash = hash_binop_atom_cons(MATH_MUL, HASH_ANY, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(`${this.name} exp=${print_expr(exp, $)}`);
        const X = lhs;
        const k = rhs.rhs;
        const p1 = items_to_cons(rhs.opr, X, k.succ());
        // console.lg(`p1=${print_expr(p1, $)}`);
        const p2 = $.valueOf(p1);
        return [TFLAG_DIFF, p2];
    }
}

export const mul_2_X_pow_2_X_rat = mkbuilder<EXP>(Op);
