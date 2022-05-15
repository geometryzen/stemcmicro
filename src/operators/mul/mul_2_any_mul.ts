import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul } from "./is_mul";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (* a (* b1 b2 b3 ...)) => (* a b1 b2 b3 ...) 
 */
class Op extends Function2<U, Cons> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_any_mul', MATH_MUL, is_any, and(is_cons, is_mul), $);
    }
    transform2(opr: Sym, lhs: U, rhs: Cons, expr: BCons<Sym, U, Cons>): [TFLAGS, U] {
        const $ = this.$;
        if ($.implicateMode) {
            return [CHANGED, makeList(MATH_MUL, lhs, ...rhs.tail())];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_any_mul = new Builder();
