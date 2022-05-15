import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/FltExtension";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJUGATE } from "./MATH_CONJUGATE";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjRat($);
    }
}

class ConjRat extends Function1<Flt> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_flt', MATH_CONJUGATE, is_flt, $);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [CHANGED, arg];
    }
}

export const conj_flt = new Builder();
