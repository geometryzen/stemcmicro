import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from './env/ExtensionEnv';
import { Native } from './native/Native';
import { native_sym } from './native/native_sym';
import { evaluate_as_float } from './operators/float/float';
import { is_flt } from './operators/flt/is_flt';
import { replace_assign_with_testeq } from './operators/predicate/replace_assign_with_testeq';
import { is_rat } from './operators/rat/is_rat';
import { simplify } from './operators/simplify/simplify';
import { MSIGN } from './runtime/constants';
import { isZeroLikeOrNonZeroLikeOrUndetermined } from './scripting/isZeroLikeOrNonZeroLikeOrUndetermined';
import { cadr, cddr } from './tree/helpers';
import { one, zero } from './tree/rat/Rat';
import { car, cdr, cons, Cons, is_cons, items_to_cons, nil, U } from './tree/tree';

const NOT = native_sym(Native.not);
const TESTEQ = native_sym(Native.test_eq);

// If the number of args is odd then the last arg is the default result.
// Works like a switch statement. Could also be used for piecewise
// functions? TODO should probably be called "switch"?
export function Eval_test(expr: Cons, $: ExtensionEnv): U {
    return _test(expr, $);
}

function _test(p1: U, $: ExtensionEnv): U {
    const orig = p1;
    p1 = cdr(p1);
    while (is_cons(p1)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (nil === cdr(p1)) {
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
        }
        else if (checkResult) {
            // test succesful, we found out output
            return $.valueOf(cadr(p1));
        }
        else {
            // test unsuccessful, continue to the
            // next pair of test,value
            p1 = cddr(p1);
        }
    }

    // no test matched and there was no
    // catch-all case, so we return zero.
    return zero;
}

export function Eval_testne(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    return $.valueOf(items_to_cons(NOT, cons(TESTEQ, argList)));
}

// we test A==B by first subtracting and checking if we symbolically
// get zero. If not, we evaluate to float and check if we get a zero.
// If we get another NUMBER then we know they are different.
// If we get something else, then we don't know and we return the
// unaveluated test, which is the same as saying "maybe".
export function Eval_testeq(expr: Cons, $: ExtensionEnv): U {
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
        return zero;
    }
    else if (checkResult != null && !checkResult) {
        return one;
    }

    // we didn't get a simple numeric result but
    // let's try again after doing
    // a simplification on both sides
    const simpleLhs = simplify(lhs, $);
    const simpleRhs = simplify(rhs, $);

    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined($.subtract(simpleLhs, simpleRhs), $);
    if (checkResult) {
        return zero;
    }
    else if (checkResult != null && !checkResult) {
        return one;
    }

    // if we didn't get to a number then we
    // don't know whether the quantities are
    // different so do nothing
    return orig;
}

// Relational operators expect a numeric result for operand difference.
export function Eval_testge(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);

    if (comparison == null) {
        return orig;
    }

    if (comparison >= 0) {
        return one;
    }
    else {
        return zero;
    }
}

export function Eval_testgt(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);

    if (comparison == null) {
        return orig;
    }

    if (comparison > 0) {
        return one;
    }
    else {
        return zero;
    }
}

export function Eval_testle(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);

    if (comparison == null) {
        return orig;
    }

    if (comparison <= 0) {
        return one;
    }
    else {
        return zero;
    }
}

export function Eval_testlt(expr: Cons, $: ExtensionEnv): U {
    const orig = expr;
    const comparison = cmp_args(expr, $);
    // console.lg(`comparison => ${comparison}`);

    if (comparison == null) {
        // I hope this is dead code.
        return orig;
    }

    if (comparison < 0) {
        return one;
    }
    else {
        return zero;
    }
}

/**
 * not is used to implement testne by using testeq.
 */
export function Eval_not(expr: Cons, $: ExtensionEnv): U {
    const value = $.valueOf(replace_assign_with_testeq(expr.argList.head));
    // console.lg("Eval_not", $.toInfixString(value));
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);
    if (checkResult == null) {
        // inconclusive test on predicate
        return expr;
    }
    else if (checkResult) {
        // true -> false
        return zero;
    }
    else {
        // false -> true
        return one;
    }
}

/* and =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
a,b,...

General description
-------------------
Logical-and of predicate expressions.

*/

// and definition
export function Eval_and(p1: U, $: ExtensionEnv): U {
    const wholeAndExpression = p1;
    let andPredicates = cdr(wholeAndExpression);
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
        }
        else if (checkResult) {
            // found a true, move on to the next predicate
            andPredicates = cdr(andPredicates);
        }
        else if (!checkResult) {
            // found a false, enough to falsify everything and return
            return zero;
        }
    }

    // We checked all the predicates and none of them
    // was false. So they were all either true or unknown.
    // Now, if even just one was unknown, we'll have to call this
    // test as inconclusive and return the whole test expression.
    // If all the predicates were known, then we can conclude
    // that the test returns true.
    if (somePredicateUnknown) {
        return wholeAndExpression;
    }
    else {
        return one;
    }
}

// or definition
export function Eval_or(p1: U, $: ExtensionEnv): U {
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
        }
        else if (checkResult) {
            // found a true, enough to return true
            return one;
        }
        else if (!checkResult) {
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
    }
    else {
        return zero;
    }
}

// use subtract for cases like A < A + 1

// TODO you could be smarter here and
// simplify both sides only in the case
// of "relational operator: cannot determine..."
// a bit like we do in Eval_testeq
/**
 * Supports testge, testgt, testle, testlt
 * @param expr An binary expression containing (testxx lhs rhs) whre xx is one of ge,gt,le,lt.
 */
function cmp_args(expr: Cons, $: ExtensionEnv): Sign | null {
    // console.lg("cmp_args", $.toInfixString(expr));
    const lhs = simplify($.valueOf(expr.lhs), $);
    const rhs = simplify($.valueOf(expr.rhs), $);
    // console.lg("lhs", $.toInfixString(lhs));
    // console.lg("rhs", $.toInfixString(rhs));

    let diff = $.subtract(lhs, rhs);

    // console.lg("diff", $.toInfixString(diff));

    // try floating point if necessary
    // This will go recursive and you will think your values are being promoted.
    // Stay calm! Don't panic.
    if (!is_rat(diff) && !is_flt(diff)) {
        diff = $.valueOf(evaluate_as_float(diff, $));
    }

    // console.lg("diff", $.toInfixString(diff));

    if ($.is_zero(diff)) {
        return SIGN_EQ;
    }

    if (is_rat(diff)) {
        if (MSIGN(diff.a) === -1) {
            return SIGN_LT;
        }
        else {
            return SIGN_GT;
        }
    }
    else if (is_flt(diff)) {
        if (diff.d < 0.0) {
            return SIGN_LT;
        }
        else {
            return SIGN_GT;
        }
    }
    else {
        return null;
    }
}
