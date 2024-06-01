import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_any } from "../mul/is_mul_2_rat_any";

function cross(lhs: Cons2<Sym, Rat, U>, rhs: Cons2<Sym, Rat, U>): boolean {
    const x1 = lhs.rhs;
    const x2 = rhs.rhs;
    if (x1.equals(x2)) {
        return true;
    }
    return false;
}

/**
 * (p * X) + (q * X) => (p + q) * X
 */
class Op extends Function2X<Cons2<Sym, Rat, U>, Cons2<Sym, Rat, U>> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_mul_2_rat_X_mul_2_rat_X", MATH_ADD, and(is_cons, is_mul_2_rat_any), and(is_cons, is_mul_2_rat_any), cross);
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, Rat, U>, rhs: Cons2<Sym, Rat, U>, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const p = lhs.lhs;
        const X = lhs.rhs;
        const q = rhs.lhs;
        const pq = p.add(q);
        const retval = $.valueOf(items_to_cons(MATH_MUL, pq, X));
        return [TFLAG_DIFF, retval];
    }
}

export const add_2_mul_2_rat_X_mul_2_rat_X = mkbuilder(Op);
