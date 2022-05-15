
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";
import { is_flt } from "../flt/FltExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_uom } from "../uom/UomExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Flt * Uom
 */
class Op extends Function2<Flt, Uom> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_flt_uom', MATH_MUL, is_flt, is_uom, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_UOM);
    }
    transform2(opr: Sym, lhs: Flt, rhs: Uom, expr: BCons<Sym, Flt, Uom>): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [CHANGED, lhs];
        }
        if (lhs.isOne()) {
            return [CHANGED, rhs];
        }
        return [STABLE, expr];
    }
}

export const mul_2_flt_uom = new Builder();
