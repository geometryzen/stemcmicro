import { Blade, is_blade } from "math-expression-atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_BLADE } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_blade_any } from "../mul/is_mul_2_blade_any";

type LHS = Blade;
type RHS = Cons2<Sym, Blade, U>;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Blade1 * (Blade2 * X) => (Blade1 * Blade2) * X
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('simplify_mul_2_blade_mul_2_blade_any', MATH_MUL, is_blade, and(is_cons, is_mul_2_blade_any));
        this.#hash = hash_binop_atom_cons(MATH_MUL, HASH_BLADE, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const b1 = lhs;
        const b2 = rhs.lhs;
        const b1b2 = b1.mul(b2);
        const X = rhs.rhs;
        const S = $.valueOf(items_to_cons(MATH_MUL, b1b2, X));
        return [TFLAG_DIFF, S];
    }
}

export const simplify_mul_2_blade_mul_2_blade_any = mkbuilder<EXP>(Op);
