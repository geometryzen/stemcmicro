
import { Blade, is_blade, Sym } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_RCO } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";


class Op extends Function2<Blade, Blade> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('rco_2_blade_blade', MATH_RCO, is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_RCO, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.rshift(rhs)];
    }
}

export const rco_2_blade_blade = make_extension_builder(Op);
