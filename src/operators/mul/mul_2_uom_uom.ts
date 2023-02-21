
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_UOM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";
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
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Uom'];
    constructor($: ExtensionEnv) {
        super('mul_2_uom_uom', MATH_MUL, is_uom, is_uom, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_UOM, HASH_UOM);
    }
    transform2(opr: Sym, lhs: Uom, rhs: Uom): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.mul(rhs)];
    }
}

export const mul_2_uom_uom = new Builder();
