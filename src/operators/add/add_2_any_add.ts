import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add } from "./is_add";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new AddAnyAdd($);
    }
}

/**
 * (+ a (+ b1 b2 b3 ...)) => (+ a b1 b2 b3 ...) 
 */
class AddAnyAdd extends Function2<U, Cons> implements Operator<Cons> {
    readonly name = 'add_2_any_add';
    constructor($: ExtensionEnv) {
        super('add_2_any_add', MATH_ADD, is_any, and(is_cons, is_add), $);
    }
    transform2(opr: Sym, lhs: U, rhs: Cons, orig: BCons<Sym, U, Cons>): [TFLAGS, U] {
        const $ = this.$;
        if ($.implicateMode) {
            return [CHANGED, $.valueOf(makeList(opr, lhs, ...rhs.tail()))];
        }
        return [NOFLAGS, orig];
    }
}

export const add_2_any_add = new Builder();
