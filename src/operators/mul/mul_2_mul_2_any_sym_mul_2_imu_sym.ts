import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";
import { is_mul_2_imu_any } from "./is_mul_2_imu_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (X * a) * (i * Y) => (X * i) * (a * Y) 
 */
class Op extends Function2<BCons<Sym, U, Sym>, BCons<Sym, BCons<Sym, Rat, Rat>, U>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_mul_2_imu_sym', MATH_MUL, and(is_cons, is_mul_2_any_sym), and(is_cons, is_mul_2_imu_any), $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: BCons<Sym, BCons<Sym, Rat, Rat>, U>): [TFLAGS, U] {
        const X = lhs.lhs;
        const a = lhs.rhs;
        const i = rhs.lhs;
        const Y = rhs.rhs;
        return [CHANGED, makeList(MATH_MUL, makeList(MATH_MUL, X, i), makeList(MATH_MUL, a, Y))];
    }
}

export const mul_2_mul_2_any_sym_mul_2_imu_sym = new Builder();
