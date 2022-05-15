import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_imu } from "../../predicates/is_imu";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { makeList, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJUGATE } from "./MATH_CONJUGATE";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjImaginaryUnit($);
    }
}

class ConjImaginaryUnit extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_imu', MATH_CONJUGATE, is_imu, $);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        return [CHANGED, makeList(MATH_MUL, negOne, arg)];
    }
}

export const conj_imaginary_unit = new Builder();
