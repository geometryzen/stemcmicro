import { binop } from "../../calculators/binop";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_E, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { MATH_EXP } from "./MATH_EXP";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Exp($);
    }
}

class Exp extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('exp_any', MATH_EXP, is_any, $);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        return [CHANGED, binop(MATH_POW, MATH_E, arg, this.$)];
    }
}

export const exp_any = new Builder();
