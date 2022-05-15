import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { negOne, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_inner_2_sym_sym } from "../mul/is_mul_2_rat_inner_2_sym_sym";
import { is_outer_2_sym_sym } from "../outer/is_outer_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * 
 */
function cross(lhs: BCons<Sym, Rat, BCons<Sym, Sym, Sym>>, rhs: BCons<Sym, Sym, Sym>): boolean {
    const num = lhs.lhs;
    const a1 = lhs.rhs.lhs;
    const b1 = lhs.rhs.rhs;
    const a2 = rhs.lhs;
    const b2 = rhs.rhs;
    return num.isMinusOne() && a1.equals(a2) && b1.equals(b2);
}

/**
 * (-1 * a|b) + a^b => -b*a 
 */
class Op extends Function2X<BCons<Sym, Rat, BCons<Sym, Sym, Sym>>, BCons<Sym, Sym, Sym>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_rat_inner_2_sym_sym_outer_2_sym_sym', MATH_ADD, and(is_cons, is_mul_2_rat_inner_2_sym_sym), and(is_cons, is_outer_2_sym_sym), cross, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, BCons<Sym, Sym, Sym>>, rhs: BCons<Sym, Sym, Sym>, orig: BCons<Sym, BCons<Sym, U, U>, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isFactoring()) {
            const a = lhs.rhs.lhs;
            const b = lhs.rhs.rhs;
            return [CHANGED, makeList(MATH_MUL, negOne, makeList(MATH_MUL, b, a))];
        }
        return [NOFLAGS, orig];
    }
}

export const add_2_mul_2_rat_inner_2_sym_sym_outer_2_sym_sym = new Builder();
