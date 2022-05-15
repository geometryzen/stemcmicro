
import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, SIGN_GT, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_OUTER } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { value_of } from "../helpers/valueOf";
import { is_sym } from "../sym/is_sym";

function canoncal_reorder_outer_factors_sym_sym(opr: Sym, lhs: Sym, rhs: Sym, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
    switch (compare_sym_sym(lhs, rhs)) {
        case SIGN_GT: {
            const A = makeList(opr, rhs, lhs);
            const C = $.negate(A);
            const D = value_of(C, $);
            return [CHANGED, D];
        }
        default: {
            return [NOFLAGS, orig];
        }
    }
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Sym, Sym> implements Operator<BCons<Sym, Sym, Sym>> {
    constructor($: ExtensionEnv) {
        super('outer_2_sym_sym', MATH_OUTER, is_sym, is_sym, $);
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, expr: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.treatAsScalar(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // scalar ^ scalar
                return [STABLE, expr];
            }
            else if ($.treatAsVector(rhs)) {
                // scalar ^ vector
                return [STABLE, expr];
            }
            else {
                // scalar ^ other
                return [STABLE, expr];
            }
        }
        else if ($.treatAsVector(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // vector ^ scalar
                return [STABLE, expr];
            }
            else if ($.treatAsVector(rhs)) {
                // vector ^ vector
                if (lhs.equals(rhs)) {
                    return [CHANGED, zero];
                }
                // How, and under what circumestances do we propose 1/2*(ab-ba)?
                // This will conflict with expanding the geometric product.
                /*
                const a = lhs;
                const b = rhs;
                const ab = makeList(MATH_MUL, a, b);
                const ba = makeList(MATH_MUL, negOne, b, a);
                const abba = makeList(MATH_ADD, ab, ba);
                const retval = makeList(MATH_MUL, half, abba);
                return [true, retval];
                */
                return canoncal_reorder_outer_factors_sym_sym(opr, lhs, rhs, expr, $);
            }
            else {
                // vector ^ other
                return [STABLE, expr];
            }
        }
        else {
            if ($.treatAsScalar(rhs)) {
                // other ^ scalar
                return [STABLE, expr];
            }
            else if ($.treatAsVector(rhs)) {
                // other ^ vector
                return [STABLE, expr];
            }
            else {
                // other ^ other
                return [STABLE, expr];
            }
        }
    }
}

export const outer_2_sym_sym = new Builder();
