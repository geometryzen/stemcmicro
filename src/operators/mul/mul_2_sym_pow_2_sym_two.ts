import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_pow_2_sym_rat } from "../pow/is_pow_2_sym_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = BCons<Sym, Sym, Rat>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const a = lhs;
        const b = rhs.lhs;
        const expo = rhs.rhs;
        return $.treatAsVector(a) && $.treatAsVector(b) && expo.isTwo();
    };
}


/**
 * a * (b ** 2) => (a*b)*b (when left associating)
 * 
 * Redundant because can be handled more fundamentally?
 */
class Op extends Function2X<LHS, RHS> implements Operator<Cons> {
    readonly name = 'mul_2_sym_pow_2_sym_two';
    constructor($: ExtensionEnv) {
        super('mul_2_sym_pow_2_sym_two', MATH_MUL, is_sym, and(is_cons, is_pow_2_sym_rat), cross($), $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: BCons<Sym, LHS, RHS>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(opr)) {
            const a = lhs;
            const b = rhs.lhs;
            const ab = makeList(MATH_MUL, a, b);
            return [CHANGED, makeList(MATH_MUL, ab, b)];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_sym_pow_2_sym_two = new Builder();
