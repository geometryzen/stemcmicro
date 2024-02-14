import { Blade, is_blade, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";


class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}
/**
 * Blade << Blade
 */
class Op extends Function2<Blade, Blade> implements Extension<Cons> {
    readonly #hash: string;
    constructor() {
        super('lco_2_blade_blade', native_sym(Native.lco), is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(lhs.lshift(rhs))];
    }
}

export const lco_2_blade_blade = new Builder();
