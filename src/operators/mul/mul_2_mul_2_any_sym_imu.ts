import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_imu } from "../../predicates/is_imu";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (X * a) * i => (X * i) * a 
 */
class Op extends Function2<BCons<Sym, U, Sym>, BCons<Sym, Rat, Rat>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_imu', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_imu, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: BCons<Sym, Rat, Rat>): [TFLAGS, U] {
        const X = lhs.lhs;
        const a = lhs.rhs;
        const i = rhs;
        return [CHANGED, makeList(MATH_MUL, makeList(MATH_MUL, X, i), a)];
    }
}

export const mul_2_mul_2_any_sym_imu = new Builder();
