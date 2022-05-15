import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { MATH_VECTOR_OR_CROSS_PRODUCT } from "./MATH_VECTOR_OR_CROSS_PRODUCT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('cross_any_any', MATH_VECTOR_OR_CROSS_PRODUCT, is_any, is_any, $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        return [NOFLAGS, expr];
    }
}

export const cross_any_any = new Builder();
