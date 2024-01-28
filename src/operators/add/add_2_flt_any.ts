import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { evaluate_as_float } from "../float/float";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Flt, U> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt'];
    constructor($: ExtensionEnv) {
        super('add_2_flt_any', MATH_ADD, is_flt, is_any, $);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_FLT, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: U, expr: Cons2<Sym, Flt, U>): [TFLAGS, U] {
        const $ = this.$;
        const rhs_as_flt = evaluate_as_float(rhs, $);
        if (lhs.isZero()) {
            return [TFLAG_DIFF, rhs_as_flt];
        }
        else {
            // Prevent infinite recursion...
            if (rhs_as_flt.equals(rhs)) {
                return [TFLAG_NONE, expr];
            }
            else {
                const sum = $.add(lhs, rhs_as_flt);
                return wrap_as_transform(sum, expr);
            }
        }
    }
}

export const add_2_flt_any = new Builder();
