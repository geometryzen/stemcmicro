import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_inner_2_any_any } from "../inner/is_inner_2_any_any";
import { MATH_CONJUGATE } from "./MATH_CONJUGATE";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjInner($);
    }
}

/**
 * conj(inner(y,x)) = inner(x,y)
 */
class ConjInner extends Function1<BCons<Sym, U, U>> implements Operator<BCons<Sym, U, U>> {
    constructor($: ExtensionEnv) {
        super('conj_inner', MATH_CONJUGATE, and(is_cons, is_inner_2_any_any), $);
    }
    transform1(opr: Sym, arg: BCons<Sym, U, U>): [TFLAGS, U] {
        return [CHANGED, makeList(arg.opr, arg.rhs, arg.lhs)];
    }
}

export const conj_inner = new Builder();
