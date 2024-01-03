import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjBlade($);
    }
}

class ConjBlade extends Function1<Blade> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_blade', MATH_CONJ, is_blade, $);
    }
    transform1(opr: Sym, arg: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.rev()];
    }
}

export const conj_blade = new Builder();
