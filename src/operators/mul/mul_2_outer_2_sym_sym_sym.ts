import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_outer_2_sym_sym } from "../outer/is_outer_2_sym_sym";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross($: ExtensionEnv) {
    return function (lhs: BCons<Sym, Sym, Sym>, rhs: Sym) {
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        return $.treatAsVector(a) && $.treatAsVector(b) && $.treatAsVector(c);
    };
}

/**
 * TODO: Why not just replace the outer product?
 * Under what conditions should this be done? 
 * 
 * (a ^ b) * c => a * b * c - (a|b) * c
 */
class Op extends Function2X<BCons<Sym, Sym, Sym>, Sym> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_outer_2_sym_sym_sym', MATH_MUL, and(is_cons, is_outer_2_sym_sym), is_sym, cross($), $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Sym, Sym>, rhs: Sym, expr: BCons<Sym, BCons<Sym, Sym, Sym>, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const a = lhs.lhs;
            const b = lhs.rhs;
            const c = rhs;

            const retval = $.subtract(makeList(MATH_MUL, makeList(MATH_MUL, a, b), c), makeList(MATH_MUL, makeList(MATH_INNER, a, b), c));

            return [CHANGED, retval];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_outer_2_sym_sym_sym = new Builder();
