
import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_LCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<U, U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('lco_2_any_any', MATH_LCO, is_any, is_any, $);
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: BCons<Sym, U, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const lco_2_any_any = new Builder();
