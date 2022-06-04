import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_outer_2_sym_sym } from "./is_outer_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = BCons<Sym, Sym, Sym>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const a = lhs;
        const b = rhs.lhs;
        const c = rhs.rhs;
        return $.treatAsVector(a) && $.treatAsVector(b) && $.treatAsVector(c);
    };
}

/**
 * a ^ (b ^ c) => (a ^ b) ^ c
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('outer_2_sym_outer_2_sym_sym', MATH_OUTER, is_sym, and(is_cons, is_outer_2_sym_sym), cross($), $);
    }
    transform2(opr: Sym, lhs: Sym, rhs: RHS, expr: BCons<Sym, Sym, RHS>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_OUTER)) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            const ab = items_to_cons(opr, a, b);
            const retval = items_to_cons(rhs.opr, ab, c);
            return [TFLAG_DIFF, retval];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const outer_2_sym_outer_2_sym_sym = new Builder();
