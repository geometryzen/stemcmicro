
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const mul_2_flt_flt = new Builder();

class Op extends Function2<Flt, Flt> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_flt_flt', MATH_MUL, is_flt, is_flt, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_FLT);
    }
    transform2(opr: Sym, lhs: Flt, rhs: Flt): [TFLAGS, U] {
        return [CHANGED, lhs.mul(rhs)];
    }
}
