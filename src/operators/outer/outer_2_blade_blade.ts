
import { Blade, is_blade, Sym } from "math-expression-atoms";
import { Cons2, U } from "math-expression-tree";
import { FEATURE, make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

/**
 * Blade ^ Blade
 */
class OuterBladeBlade extends Function2<Blade, Blade> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor() {
        super('outer_2_blade_blade', MATH_OUTER, is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_OUTER, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.wedge(rhs)];
    }
}

export const outer_2_blade_blade = make_extension_builder<Cons2<Sym, Blade, Blade>>(OuterBladeBlade);
