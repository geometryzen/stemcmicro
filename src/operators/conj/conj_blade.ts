import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJUGATE } from "./MATH_CONJUGATE";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjBlade($);
    }
}

class ConjBlade extends Function1<Blade> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_blade', MATH_CONJUGATE, is_blade, $);
    }
    transform1(opr: Sym, arg: Blade): [TFLAGS, U] {
        return [CHANGED, arg.rev()];
    }
}

export const conj_blade = new Builder();
