import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross($: ExtensionEnv) {
    return function (lhs: BCons<Sym, U, U>, rhs: BCons<Sym, U, U>): boolean {
        if ($.isFactoring()) {
            const x1 = lhs.rhs;
            const x2 = rhs.rhs;
            if (x1.equals(x2)) {
                return true;
            }
            return false;
        }
        else {
            return false;
        }
    };
}
/*
function canReduceByFactoringOnRight(lhs: U, rhs: U): boolean {
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
            const xL = lhs.rhs;
            const xR = rhs.rhs;
            if (xL.equals(xR)) {
                return canReduceByFactoringOnRight(lhs.lhs, rhs.lhs);
            }
        }
        if (is_rat(lhs.lhs) && lhs.rhs.equals(rhs)) {
            return true;
        }
    }
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        if (is_rat(rhs.lhs) && rhs.rhs.equals(lhs)) {
            return true;
        }
    }
    if (is_rat(lhs)) {
        if (is_rat(rhs)) {
            return true;
        }
    }
    // console.lg(`lhs=${lhs}, rhs=${rhs}`);
    return false;
}
*/
/*
function reduceByFactoringOnRight(lhs: U, rhs: U, common: U, $: ExtensionEnv): U {
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
            const X = lhs.rhs;
            if (X.equals(rhs.rhs)) {
                return reduceByFactoringOnRight(lhs.lhs, rhs.lhs, $.multiply(X, common), $);
            }
        }
        if (is_rat(lhs.lhs) && lhs.rhs.equals(rhs)) {
            return $.multiply($.multiply(lhs.lhs.succ(), rhs), common);
        }
    }
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        if (is_rat(rhs.lhs) && rhs.rhs.equals(lhs)) {
            return $.multiply($.multiply(rhs.lhs.succ(), lhs), common);
        }
    }
    if (is_rat(lhs)) {
        if (is_rat(rhs)) {
            return $.multiply(lhs.add(rhs), common);
        }
    }
    throw new Error(`lhs=${lhs}, rhs=${rhs}`);
}
*/

/**
 * (A * X) + (B * X) => (A + B) * X
 */
class Op extends Function2X<BCons<Sym, U, U>, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly hash = '(+ (*) (*))';
    constructor($: ExtensionEnv) {
        super('mul_rhs_distrib_over_add_factor', MATH_ADD, and(is_cons, is_mul_2_any_any), and(is_cons, is_mul_2_any_any), cross($), $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: BCons<Sym, U, U>): [TFLAGS, U] {
        const $ = this.$;
        /*
        if (canReduceByFactoringOnRight(lhs, rhs)) {
            return [true, reduceByFactoringOnRight(lhs, rhs, one, $)];
        }
        */
        const A = lhs.lhs;
        const B = rhs.lhs;
        const X = lhs.rhs;
        const AB = $.valueOf(makeList(opr, A, B));
        return [CHANGED, $.valueOf(makeList(MATH_MUL, AB, X))];
    }
}

/**
 * (A * X) + (B * X) => (A + B) * X
 */
export const mul_rhs_distrib_over_add_factor = new Builder();
