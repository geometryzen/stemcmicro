import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { is_imu } from "../../predicates/is_imu";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
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
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_imu', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_imu, $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: BCons<Sym, Rat, Rat>): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const a = lhs.rhs;
        const i = rhs;
        const Xi = $.valueOf(makeList(MATH_MUL, X, i));
        const Xia = $.valueOf(makeList(MATH_MUL, Xi, a));
        return [CHANGED, Xia];
    }
}

export const mul_2_mul_2_any_sym_imu = new Builder();
