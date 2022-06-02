
import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_INNER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Inner($);
    }
}

/**
 * This is currently implemented as a non-mangling operator.
 * 
 * TODO: This appears to be the same as inner_2_any_any?
 */
class Inner extends Function2<U, U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('inner', MATH_INNER, is_any, is_any, $);
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: BCons<Sym, U, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const inner = new Builder();
