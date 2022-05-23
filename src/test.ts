import { ExtensionEnv, Sign, SIGN_EQ } from './env/ExtensionEnv';
import { yyfloat } from './operators/float/float';
import { MSIGN } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { isZeroLikeOrNonZeroLikeOrUndetermined } from './scripting/isZeroLikeOrNonZeroLikeOrUndetermined';
import { simplify } from './simplify';
import { is_flt } from './tree/flt/is_flt';
import { caddr, cadr, cddr } from './tree/helpers';
import { is_rat } from './tree/rat/is_rat';
import { one, zero } from './tree/rat/Rat';
import { car, cdr, Cons, is_cons, NIL, U } from './tree/tree';

// If the number of args is odd then the last arg is the default result.
// Works like a switch statement. Could also be used for piecewise
// functions? TODO should probably be called "switch"?
export function Eval_test(p1: U, $: ExtensionEnv): void {
    stack_push(_test(p1, $));
}
function _test(p1: U, $: ExtensionEnv): U {
    const orig = p1;
    p1 = cdr(p1);
    while (is_cons(p1)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (NIL === cdr(p1)) {
            return $.valueOf(car(p1)); // default case
        }

        const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(p1), $);
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

// we test A==B by first subtracting and checking if we symbolically
// get zero. If not, we evaluate to float and check if we get a zero.
// If we get another NUMBER then we know they are different.
// If we get something else, then we don't know and we return the
// unaveluated test, which is the same as saying "maybe".
export function Eval_testeq(p1: U, $: ExtensionEnv) {
    // first try without simplifyng both sides
    const orig = p1;
    let subtractionResult = $.subtract($.valueOf(cadr(p1)), $.valueOf(caddr(p1)));

    // OK so we are doing something tricky here
    // we are using isZeroLikeOrNonZeroLikeOrUndetermined to check if the result
    // is zero or not zero or unknown.
    // isZeroLikeOrNonZeroLikeOrUndetermined has some routines
    // to determine the zero-ness/non-zero-ness or
    // undeterminate-ness of things so we use
    // that here and down below.
    let checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(subtractionResult, $);
    if (checkResult) {
        stack_push(zero);
        return;
    }
    else if (checkResult != null && !checkResult) {
        stack_push(one);
        return;
    }

    // we didn't get a simple numeric result but
    // let's try again after doing
    // a simplification on both sides
    const arg1 = simplify($.valueOf(cadr(p1)), $);
    const arg2 = simplify($.valueOf(caddr(p1)), $);
    subtractionResult = $.subtract(arg1, arg2);

    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(subtractionResult, $);
    if (checkResult) {
        stack_push(zero);
        return;
    }
    else if (checkResult != null && !checkResult) {
        stack_push(one);
        return;
    }

    // if we didn't get to a number then we
    // don't know whether the quantities are
    // different so do nothing
    stack_push(orig);
}

// Relational operators expect a numeric result for operand difference.
export function Eval_testge(p1: U, $: ExtensionEnv) {
    const orig = p1;
    const comparison = cmp_args(p1, $);

    if (comparison == null) {
        stack_push(orig);
        return;
    }

    if (comparison >= 0) {
        stack_push(one);
    }
    else {
        stack_push(zero);
    }
}

export function Eval_testgt(p1: U, $: ExtensionEnv) {
    const orig = p1;
    const comparison = cmp_args(p1, $);

    if (comparison == null) {
        stack_push(orig);
        return;
    }

    if (comparison > 0) {
        stack_push(one);
    }
    else {
        stack_push(zero);
    }
}

export function Eval_testle(p1: U, $: ExtensionEnv) {
    const orig = p1;
    const comparison = cmp_args(p1, $);

    if (comparison == null) {
        stack_push(orig);
        return;
    }

    if (comparison <= 0) {
        stack_push(one);
    }
    else {
        stack_push(zero);
    }
}

export function Eval_testlt(arg: U, $: ExtensionEnv) {
    const orig = arg;
    const comparison = cmp_args(arg, $);
    // console.lg(`comparison => ${comparison}`);

    if (comparison == null) {
        // I hope this is dead code.
        stack_push(orig);
        return;
    }

    if (comparison < 0) {
        stack_push(one);
    }
    else {
        stack_push(zero);
    }
}

// not definition
export function Eval_not(expr: Cons, $: ExtensionEnv): U {
    const wholeAndExpression = expr;
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(expr), $);
    if (checkResult == null) {
        // inconclusive test on predicate
        return wholeAndExpression;
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
export function Eval_and(p1: U, $: ExtensionEnv) {
    const wholeAndExpression = p1;
    let andPredicates = cdr(wholeAndExpression);
    let somePredicateUnknown = false;
    while (is_cons(andPredicates)) {
        // eval each predicate
        const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(andPredicates), $);

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
            stack_push(zero);
            return;
        }
    }

    // We checked all the predicates and none of them
    // was false. So they were all either true or unknown.
    // Now, if even just one was unknown, we'll have to call this
    // test as inconclusive and return the whole test expression.
    // If all the predicates were known, then we can conclude
    // that the test returns true.
    if (somePredicateUnknown) {
        stack_push(wholeAndExpression);
    }
    else {
        stack_push(one);
    }
}

// or definition
export function Eval_or(p1: U, $: ExtensionEnv): U {
    const wholeOrExpression = p1;
    let orPredicates = cdr(wholeOrExpression);
    let somePredicateUnknown = false;
    while (is_cons(orPredicates)) {
        // eval each predicate
        const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(orPredicates), $);

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
 * 
 * @param args 
 * @param $ 
 * @returns 
 */
function cmp_args(args: U, $: ExtensionEnv): Sign | null {
    let t: Sign | null = SIGN_EQ;
    const arg1 = simplify($.valueOf(cadr(args)), $);

    const arg2 = simplify($.valueOf(caddr(args)), $);

    let diff = $.subtract(arg1, arg2);

    // try floating point if necessary
    // This will go recursive and you will think your values are being promoted.
    // Stay calm! Don't panic.
    if (!is_rat(diff) && !is_flt(diff)) {
        diff = $.valueOf(yyfloat(diff, $));
    }

    if ($.isZero(diff)) {
        return 0;
    }

    if (is_rat(diff)) {
        if (MSIGN(diff.a) === -1) {
            t = -1;
        }
        else {
            t = 1;
        }
    }
    else if (is_flt(diff)) {
        if (diff.d < 0.0) {
            t = -1;
        }
        else {
            t = 1;
        }
    }
    else {
        t = null;
    }
    return t;
}
