import { booU } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "./env/ExtensionEnv";
import { iszero } from "./helpers/iszero";
import { predicate_return_value } from "./helpers/predicate_return_value";
import { subtract } from "./helpers/subtract";
import { Native } from "./native/Native";
import { native_sym } from "./native/native_sym";
import { evaluate_as_float } from "./operators/float/float";
import { is_flt } from "./operators/flt/is_flt";
import { replace_assign_with_testeq } from "./operators/predicate/replace_assign_with_testeq";
import { is_rat } from "./operators/rat/is_rat";
import { simplify } from "./operators/simplify/simplify";
import { isZeroLikeOrNonZeroLikeOrUndetermined } from "./scripting/isZeroLikeOrNonZeroLikeOrUndetermined";
import { cadr, cddr } from "@stemcmicro/tree";
import { zero } from "./tree/rat/Rat";
import { car, cdr, cons, Cons, is_cons, items_to_cons, U } from "./tree/tree";

const NOT = native_sym(Native.not);
const TESTEQ = native_sym(Native.testeq);

// If the number of args is odd then the last arg is the default result.
// Works like a switch statement. Could also be used for piecewise
// functions? TODO should probably be called "switch"?
export function eval_test(expr: Cons, $: ExtensionEnv): U {
    return _test(expr, $);
}

function _test(p1: U, $: ExtensionEnv): U {
    const orig = p1;
    p1 = cdr(p1);
    while (is_cons(p1)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (cdr(p1).isnil) {
            return $.valueOf(car(p1)); // default case
        }

        const value = $.valueOf(replace_assign_with_testeq(car(p1)));
        const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);
        if (checkResult == null) {
            // we couldn't determine the result
            // of a test. This means we can't conclude
            // anything about the result of the
            // overall test, so we must bail
            // with the unevalled test
            return orig;
        } else if (checkResult) {
            // test succesful, we found out output
            return $.valueOf(cadr(p1));
        } else {
            // test unsuccessful, continue to the
            // next pair of test,value
            p1 = cddr(p1);
        }
    }

    // no test matched and there was no
    // catch-all case, so we return zero.
    return zero;
}

export function eval_testne(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    return $.valueOf(items_to_cons(NOT, cons(TESTEQ, argList)));
}

// we test A==B by first subtracting and checking if we symbolically
// get zero. If not, we evaluate to float and check if we get a zero.
// If we get another NUMBER then we know they are different.
// If we get something else, then we don't know and we return the
// unaveluated test, which is the same as saying "maybe".
export function eval_testeq(expr: Cons, $: ExtensionEnv): U {
    // console.lg("eval_testeq", `${expr}`);
    // first try without simplifyng both sides
    const orig = expr;
    const lhs = $.valueOf(orig.lhs);
    const rhs = $.valueOf(orig.rhs);

    // OK so we are doing something tricky here
    // we are using isZeroLikeOrNonZeroLikeOrUndetermined to check if the result
    // is zero or not zero or unknown.
    // isZeroLikeOrNonZeroLikeOrUndetermined has some routines
    // to determine the zero-ness/non-zero-ness or
    // undeterminate-ness of things so we use
    // that here and down below.
    const value = $.valueOf(replace_assign_with_testeq($.subtract(lhs, rhs)));
    let checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);
    if (checkResult) {
        return predicate_return_value(false, $);
    } else if (checkResult != null && !checkResult) {
        return predicate_return_value(true, $);
    }

    // we didn't get a simple numeric result but
    // let's try again after doing
    // a simplification on both sides
    const simpleLhs = simplify(lhs, $);
    const simpleRhs = simplify(rhs, $);

    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined($.subtract(simpleLhs, simpleRhs), $);
    if (checkResult) {
        return predicate_return_value(false, $);
    } else if (checkResult != null && !checkResult) {
        return predicate_return_value(true, $);
    }

    // We return the fuzzy boolean value which gives downstream processing a chance to interpret the result.
    return booU;
}

// Relational operators expect a numeric result for operand difference.
export function eval_testge(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);

    if (comparison == null) {
        return orig;
    }

    if (comparison >= 0) {
        return predicate_return_value(true, $);
    } else {
        return predicate_return_value(false, $);
    }
}

export function eval_testgt(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);

    if (comparison == null) {
        return orig;
    }

    if (comparison > 0) {
        return predicate_return_value(true, $);
    } else {
        return predicate_return_value(false, $);
    }
}

export function eval_testle(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);

    if (comparison == null) {
        return orig;
    }

    if (comparison <= 0) {
        return predicate_return_value(true, $);
    } else {
        return predicate_return_value(false, $);
    }
}

export function eval_testlt(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);
    // console.lg(`comparison => ${comparison}`);

    if (comparison == null) {
        // I hope this is dead code.
        return orig;
    }

    if (comparison < 0) {
        return predicate_return_value(true, $);
    } else {
        return predicate_return_value(false, $);
    }
}

/**
 * not is used to implement testne by using testeq.
 */
export function eval_not(expr: Cons, $: ExtensionEnv): U {
    const value = $.valueOf(replace_assign_with_testeq(expr.argList.head));
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);
    if (checkResult == null) {
        // inconclusive test on predicate
        return expr;
    } else if (checkResult) {
        return predicate_return_value(false, $);
    } else {
        return predicate_return_value(true, $);
    }
}

export function eval_and(expr: Cons, $: ExtensionEnv): U {
    let andPredicates = cdr(expr);
    let somePredicateUnknown = false;
    while (is_cons(andPredicates)) {
        const value = $.valueOf(replace_assign_with_testeq(car(andPredicates)));
        const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);

        if (checkResult == null) {
            // here we have stuff that is not reconducible to any
            // numeric value (or tensor with numeric values) e.g.
            // 'a+b', so it just means that we just don't know the
            // truth value of this particular predicate.
            // We'll track the fact that we found an unknown
            // predicate and we continue with the other predicates.
            // (note that in case some subsequent predicate will be false,
            // it won't matter that we found some unknowns and
            // the whole test will be immediately zero).
            somePredicateUnknown = true;
            andPredicates = cdr(andPredicates);
        } else if (checkResult) {
            // found a true, move on to the next predicate
            andPredicates = cdr(andPredicates);
        } else if (!checkResult) {
            // found a false, enough to falsify everything and return
            return predicate_return_value(false, $);
        }
    }

    // We checked all the predicates and none of them
    // was false. So they were all either true or unknown.
    // Now, if even just one was unknown, we'll have to call this
    // test as inconclusive and return the whole test expression.
    // If all the predicates were known, then we can conclude
    // that the test returns true.
    if (somePredicateUnknown) {
        return expr;
    } else {
        return predicate_return_value(true, $);
    }
}

// or definition
export function eval_or(p1: Cons, $: ExtensionEnv): U {
    const wholeOrExpression = p1;
    let orPredicates = cdr(wholeOrExpression);
    let somePredicateUnknown = false;
    while (is_cons(orPredicates)) {
        // eval each predicate
        const value = $.valueOf(replace_assign_with_testeq(car(orPredicates)));
        const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);

        if (checkResult == null) {
            // here we have stuff that is not reconducible to any
            // numeric value (or tensor with numeric values) e.g.
            // 'a+b', so it just means that we just don't know the
            // truth value of this particular predicate.
            // We'll track the fact that we found an unknown
            // predicate and we continue with the other predicates.
            // (note that in case some subsequent predicate will be false,
            // it won't matter that we found some unknowns and
            // the whole test will be immediately zero).
            somePredicateUnknown = true;
            orPredicates = cdr(orPredicates);
        } else if (checkResult) {
            // found a true, enough to return true
            return predicate_return_value(true, $);
        } else if (!checkResult) {
            // found a false, move on to the next predicate
            orPredicates = cdr(orPredicates);
        }
    }

    // We checked all the predicates and none of them
    // was true. So they were all either false or unknown.
    // Now, if even just one was unknown, we'll have to call this
    // test as inconclusive and return the whole test expression.
    // If all the predicates were known, then we can conclude
    // that the test returns false.
    if (somePredicateUnknown) {
        return wholeOrExpression;
    } else {
        return predicate_return_value(false, $);
    }
}

/**
 *
 */
function cmp_args(expr: Cons, $: ExprContext): Sign | null {
    const lhs = simplify($.valueOf(expr.lhs), $);
    const rhs = simplify($.valueOf(expr.rhs), $);

    let diff = subtract($, lhs, rhs);

    if (!is_rat(diff) && !is_flt(diff)) {
        diff = $.valueOf(evaluate_as_float(diff, $));
    }

    if (iszero(diff, $)) {
        return SIGN_EQ;
    }

    if (is_rat(diff)) {
        return diff.isNegative() ? SIGN_LT : SIGN_GT;
    } else if (is_flt(diff)) {
        return diff.isNegative() ? SIGN_LT : SIGN_GT;
    } else {
        return null;
    }
}
