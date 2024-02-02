
import { create_int, Uom } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_UOM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_uom } from "../uom/uom_extension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Uom * Uom
 */
class Op extends Function2<Uom, Uom> implements Operator<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Uom'];
    constructor($: ExtensionEnv) {
        super('mul_2_uom_uom', MATH_MUL, is_uom, is_uom, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_UOM, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Uom, rhs: Uom): [TFLAGS, U] {
        const uom = lhs.mul(rhs);
        if (uom.isOne()) {
            return [TFLAG_DIFF, create_int(1)];
        }
        else {
            return [TFLAG_DIFF, uom];
        }
    }
}

export const mul_2_uom_uom = new Builder();
