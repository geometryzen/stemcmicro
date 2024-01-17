import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/rat_extension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Blade, Rat> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_blade_rat', MATH_POW, is_blade, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_BLADE, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Rat): [TFLAGS, U] {
        if (rhs.isTwo()) {
            return [TFLAG_DIFF, lhs.mul(lhs)];
        }
        else {
            return [TFLAG_NONE, items_to_cons(opr, lhs, rhs)];
        }
    }
}

export const pow_2_blade_rat = new Builder();
