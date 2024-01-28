import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function1 } from "../helpers/Function1";
import { is_inner_2_any_any } from "../inner/is_inner_2_any_any";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjInner($);
    }
}

/**
 * conj(inner(y,x)) = inner(x,y)
 */
class ConjInner extends Function1<Cons2<Sym, U, U>> implements Operator<Cons2<Sym, U, U>> {
    constructor($: ExtensionEnv) {
        super('conj_inner', MATH_CONJ, and(is_cons, is_inner_2_any_any), $);
    }
    transform1(opr: Sym, arg: Cons2<Sym, U, U>): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(arg.opr, arg.rhs, arg.lhs)];
    }
}

export const conj_inner = new Builder();
