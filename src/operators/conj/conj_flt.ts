import { is_flt } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjRat($);
    }
}

class ConjRat extends Function1<Flt> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_flt', MATH_CONJ, is_flt, $);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const conj_flt = new Builder();
