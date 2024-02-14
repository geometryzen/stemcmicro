import { Sym } from "math-expression-atoms";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";

/**
 * (a * x) ^ y => a * (x ^ y)
 */
class Op extends Function2<Cons2<Sym, U, U>, U> {
    readonly #hash: string;
    constructor() {
        super('outer_2_mul_2_scalar_any_any', MATH_OUTER, is_mul_2_scalar_any, is_any);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, U, U>, rhs: U, expr: unknown, $: ExtensionEnv): [TFLAGS, U] {
        const a = lhs.lhs;
        const x = lhs.rhs;
        const y = rhs;
        const xy = $.valueOf(items_to_cons(MATH_OUTER, x, y));
        const axy = $.valueOf(items_to_cons(MATH_MUL, a, xy));
        return [TFLAG_DIFF, axy];
    }
}

export const outer_2_mul_2_scalar_any_any = make_extension_builder(Op);
