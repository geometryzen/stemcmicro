
import { Sym } from "math-expression-atoms";
import { Cons2, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { make_extension_builder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_RCO } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Op extends Function2<U, U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('rco_2_any_any', MATH_RCO, is_any, is_any);
        this.#hash = hash_binop_atom_atom(MATH_RCO, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: Cons2<Sym, U, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const rco_2_any_any = make_extension_builder(Op);
