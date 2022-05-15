import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJUGATE } from "./MATH_CONJUGATE";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjRat($);
    }
}

class ConjRat extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_rat', MATH_CONJUGATE, is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [CHANGED, arg];
    }
}

export const conj_rat = new Builder();
