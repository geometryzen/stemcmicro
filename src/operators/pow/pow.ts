import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (** base expo)
 */
class Op extends Function2<U, U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('power', MATH_POW, is_any, is_any, $);
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: BCons<Sym, U, U>): [TFLAGS, U] {
        return [NOFLAGS, expr];
    }
}

export const pow = new Builder();
