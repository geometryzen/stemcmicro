import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "@stemcmicro/hashing";
import { MATH_MUL, MATH_RCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";

/**
 * x >> (a * y) => a * (x >> y)
 */
class Op extends Function2<U, Cons2<Sym, U, U>> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("rco_2_any_mul_2_scalar_any", MATH_RCO, is_any, is_mul_2_scalar_any);
        this.#hash = hash_binop_atom_cons(MATH_RCO, HASH_ANY, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: U, rhs: Cons2<Sym, U, U>, expr: unknown, $: ExtensionEnv): [TFLAGS, U] {
        const x = lhs;
        const a = rhs.lhs;
        const y = rhs.rhs;
        const xy = $.valueOf(items_to_cons(opr, x, y));
        const retval = $.valueOf(items_to_cons(rhs.opr, a, xy));
        return [TFLAG_DIFF, retval];
    }
}

export const rco_2_any_mul_2_scalar_any = mkbuilder(Op);
