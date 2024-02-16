import { is_flt } from "math-expression-atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_FLT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_flt_any } from "./is_mul_2_flt_any";

/**
 * Flt1 * (Flt2 * X) => (Flt1 * Flt2) * X
 */
class Op extends Function2<Flt, Cons2<Sym, Flt, U>> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt'];
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_flt_mul_2_flt_any', MATH_MUL, is_flt, and(is_cons, is_mul_2_flt_any));
        this.#hash = hash_binop_atom_cons(MATH_MUL, HASH_FLT, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Cons2<Sym, Flt, U>, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const num1 = lhs;
        const num2 = rhs.lhs;
        const r1r2 = num1.mul(num2);
        const X = rhs.rhs;
        const S = $.valueOf(items_to_cons(MATH_MUL, r1r2, X));
        return [TFLAG_DIFF, S];
    }
}

export const mul_2_flt_mul_2_flt_any = mkbuilder(Op);
