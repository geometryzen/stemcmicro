
import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Blade * Blade
 */
class Op extends Function2<Blade, Blade> implements Operator<BCons<Sym, Blade, Blade>> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_blade_blade', MATH_MUL, is_blade, is_blade, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        const $ = this.$;
        // The result of multiplication may produce a factor of -1 or zero, so we require further evaluation.
        return [TFLAG_DIFF, $.valueOf(lhs.mul(rhs))];
    }
}

export const mul_2_blade_blade = new Builder();
