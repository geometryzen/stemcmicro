import { Blade, is_blade, Sym } from "math-expression-atoms";
import { Cons2, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_INNER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

/**
 * Blade1 | Blade2 => Blade1.scp(Blade2)
 */
class Op extends Function2<Blade, Blade> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_blade_blade", MATH_INNER, is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade, expr: Cons2<Sym, Blade, Blade>, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(lhs.scp(rhs))];
    }
}

export const inner_2_blade_blade = mkbuilder(Op);
