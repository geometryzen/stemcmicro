import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Cons, Cons2, is_cons, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_rat_any } from "./is_mul_2_rat_any";

/**
 * Combines adjacent number factors when an expression is in right-associated form.
 *
 * Rat1 * (Rat2 * X) => (Rat1 * Rat2) * X => Rat3 * X
 *
 * Transform is redundant because it can be replaced by change of association and Rat + Rat.
 */
class Op extends Function2<Rat, Cons2<Sym, Rat, U>> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_rat_mul_2_rat_any", MATH_MUL, is_rat, and(is_cons, is_mul_2_rat_any));
        this.#hash = hash_binop_atom_cons(MATH_MUL, HASH_RAT, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: Cons2<Sym, Rat, U>, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const num1 = lhs;
        const num2 = rhs.lhs;
        const r1r2 = num1.mul(num2);
        const X = rhs.rhs;
        const vX = $.valueOf(X);
        const S = items_to_cons(MATH_MUL, r1r2, vX);
        const vS = $.valueOf(S);
        return [TFLAG_DIFF, vS];
    }
}

export const mul_2_rat_mul_2_rat_any = mkbuilder(Op);
