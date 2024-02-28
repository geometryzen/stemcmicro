import { create_int, is_blade, is_flt, is_rat, is_sym, zero } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { is_atom, is_cons, items_to_cons, U } from "math-expression-tree";
import { isscalar } from "../../helpers/isscalar";
import { multiply } from "../../helpers/multiply";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";

const GRADE = native_sym(Native.grade);

export function extract_grade(arg: U, grade: number, $: ExprContext): U {
    if (is_atom(arg)) {
        const handler = $.handlerFor(arg);
        const argList = items_to_cons(create_int(grade));
        try {
            return handler.dispatch(arg, GRADE, argList, $);
        }
        finally {
            argList.release();
        }
    }
    // TODO: Do we need a generic grade(arg, n) function?
    if (is_blade(arg)) {
        const extracted = arg.extractGrade(grade);
        return extracted;
    }
    else if (is_sym(arg)) {
        // We're treating symbols as scalars.
        if (grade === 0) {
            return arg;
        }
        else {
            return zero;
        }
    }
    else if (is_flt(arg)) {
        if (grade === 0) {
            return arg;
        }
        else {
            return zero;
        }
    }
    else if (is_rat(arg)) {
        if (grade === 0) {
            return arg;
        }
        else {
            return zero;
        }
    }
    else if (is_cons(arg) && is_mul_2_any_any(arg)) {
        const lhs = arg.lhs;
        const rhs = arg.rhs;
        if (isscalar(lhs, $)) {
            return multiply($, lhs, extract_grade(rhs, grade, $));
        }
        if (isscalar(rhs, $)) {
            return multiply($, extract_grade(lhs, grade, $), rhs);
        }
        throw new Error(`extractGrade   ${lhs} * ${rhs}`);
    }
    else {
        throw new Error(`extractGrade(arg => ${arg}, grade => ${grade}) function not implemented.`);
    }
}
