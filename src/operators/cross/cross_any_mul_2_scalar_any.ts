import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";
import { MATH_VECTOR_CROSS_PRODUCT } from "./MATH_VECTOR_CROSS_PRODUCT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = U;
type RHS = BCons<Sym, U, U>;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * cross(X, a * Y)   => a * cross(X,Y), where a is a scalar.
 * (cross X (* a Y)) => (* a (cross X Y))
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('cross_any_mul_2_scalar_any', MATH_VECTOR_CROSS_PRODUCT, is_any, and(is_cons, is_mul_2_scalar_any($)), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        const $ = this.$;
        const a = rhs.lhs;
        const X = lhs;
        const Y = rhs.rhs;
        const crossXY = $.valueOf(makeList(opr, X, Y));
        const retval = $.valueOf(makeList(MATH_MUL, a, crossXY));
        return [CHANGED, retval];
    }
}

export const cross_any_mul_2_scalar_any = new Builder();
