import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { is_add_2_any_any } from "../add/is_add_2_any_any";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { MATH_VECTOR_OR_CROSS_PRODUCT } from "./MATH_VECTOR_OR_CROSS_PRODUCT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * cross(X + Y, Z)   => cross(X,Z) + cross(Y,Z)
 * (cross (+ X Y) Z) => (+ (cross X Z) (cross Y Z))
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('cross_add_2_any_any_any', MATH_VECTOR_OR_CROSS_PRODUCT, and(is_cons, is_add_2_any_any), is_any, $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const Y = lhs.rhs;
        const Z = rhs;
        const XZ = $.valueOf(makeList(opr, X, Z));
        const YZ = $.valueOf(makeList(opr, Y, Z));
        const retval = $.valueOf(makeList(lhs.opr, XZ, YZ));
        return [CHANGED, retval];
    }
}

export const cross_add_2_any_any_any = new Builder();
