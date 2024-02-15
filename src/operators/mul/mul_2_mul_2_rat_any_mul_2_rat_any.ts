import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_rat_any } from "./is_mul_2_rat_any";

type LHS = Cons2<Sym, Rat, U>;
type RHS = Cons2<Sym, Rat, U>;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (n * X) * (m * Y) => (n * m) * (X * Y) 
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_mul_2_rat_any_mul_2_rat_any', MATH_MUL, and(is_cons, is_mul_2_rat_any), and(is_cons, is_mul_2_rat_any));
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: Cons2<Sym, LHS, RHS>, $: ExtensionEnv): [TFLAGS, U] {
        const n = lhs.lhs;
        const X = lhs.rhs;
        const m = rhs.lhs;
        const Y = rhs.rhs;
        const XY = $.valueOf(items_to_cons(rhs.opr, X, Y));
        const retval = $.valueOf(items_to_cons(opr, n.mul(m), XY));
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_mul_2_rat_any_mul_2_rat_any = mkbuilder<EXP>(Op);
