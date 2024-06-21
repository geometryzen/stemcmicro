import { Sym } from "@stemcmicro/atoms";
import { HASH_ANY, hash_binop_cons_atom } from "@stemcmicro/hashing";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_MUL, MATH_RCO } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";

/**
 * (a * x) >> y => a * (x >> y)
 */
class Op extends Function2<Cons2<Sym, U, U>, U> {
    readonly #hash: string;
    constructor() {
        super("rco_2_mul_2_scalar_any_any", MATH_RCO, is_mul_2_scalar_any, is_any);
        this.#hash = hash_binop_cons_atom(MATH_RCO, MATH_MUL, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, U, U>, rhs: U, expr: unknown, $: ExtensionEnv): [TFLAGS, U] {
        const a = lhs.lhs;
        const x = lhs.rhs;
        const y = rhs;
        const xy = $.valueOf(items_to_cons(opr, x, y));
        const axy = $.valueOf(items_to_cons(lhs.opr, a, xy));
        return [TFLAG_DIFF, axy];
    }
}

export const rco_2_mul_2_scalar_any_any = mkbuilder(Op);
