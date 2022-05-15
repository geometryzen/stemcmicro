import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const add_2_any_add_2_any_any = new Builder();

/**
 * Matches X+(Y+Z) where X,Y,Z: U.
 * 
 * X+(Y+Z) => (X+Y)+Z
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<BCons<Sym, U, BCons<Sym, U, U>>> {
    constructor($: ExtensionEnv) {
        // TODO: Consider replacing the first argument with a matching function and(is_cons, is_add_2_any_any)
        super('add_2_any_add_2_any_any', MATH_ADD, is_any, and(is_cons, is_add_2_any_any), $);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>, orig: BCons<Sym, U, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_ADD)) {
            const X = lhs;
            const Y = rhs.lhs;
            const Z = rhs.rhs;
            const addXY = $.valueOf(makeList(MATH_ADD, X, Y));
            return [CHANGED, $.valueOf(makeList(MATH_ADD, addXY, Z))];
        }
        if ($.isAssocR(MATH_ADD)) {
            return [NOFLAGS, orig];
        }
        return [NOFLAGS, orig];
    }
}
