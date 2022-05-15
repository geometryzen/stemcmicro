import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { Flt, flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Flt, Rat> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('add_2_flt_rat', MATH_ADD, is_flt, is_rat, $);
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        const lhsNum = lhs.toNumber();
        const rhsNum = rhs.toNumber();
        return [CHANGED, flt(lhsNum + rhsNum)];
    }
}

export const add_2_flt_rat = new Builder();
