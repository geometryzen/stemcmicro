import { assert_cons_or_nil } from 'math-expression-tree';
import { add_terms } from './calculators/add/add_terms';
import { ExtensionEnv } from './env/ExtensionEnv';
import { guess } from './guess';
import { items_to_cons } from './makeList';
import { multiply_items } from './multiply';
import { is_add, is_multiply } from './runtime/helpers';
import { caddr, cadr } from './tree/helpers';
import { car, cdr, is_cons, nil, U } from './tree/tree';

// this function extract parts subtrees from a tree.
// It is used in two
// places that have to do with pattern matching.
// One is for integrals, where an expression or its
// subparts are matched against cases in an
// integrals table.
// Another one is for applyging tranformation patterns
// defined via PATTERN, again patterns are applied to
// either the whole expression or any of its parts.

// unclear to me at the moment
// why this is exposed as something that can
// be evalled. Never called.
export function Eval_decomp(p1: U, $: ExtensionEnv): U {
    const arg = $.valueOf(cadr(p1));
    p1 = $.valueOf(caddr(p1));

    const variable = nil.equals(p1) ? guess(arg) : p1;
    const result = decomp(false, arg, variable, $);
    return items_to_cons(nil, ...result);
}

function pushTryNotToDuplicateLocal(localStack: U[], item: U) {
    if (localStack.length > 0 && item.equals(localStack[localStack.length - 1])) {
        return false;
    }
    localStack.push(item);
    return true;
}

// returns constant expressions on the stack
export function decomp(generalTransform: boolean, p1: U, p2: U, $: ExtensionEnv): U[] {
    // is the entire expression constant?
    if (generalTransform) {
        if (!is_cons(p1)) {
            return [p1];
        }
    }
    else {
        if (!p1.contains(p2)) {
            return [p1];
        }
    }

    // sum?
    if (is_add(p1)) {
        return decomp_sum(generalTransform, p1, p2, $);
    }

    // product?
    if (is_multiply(p1)) {
        return decomp_product(generalTransform, p1, p2, $);
    }

    let p3: U = cdr(p1);

    // naive decomp if not sum or product
    const stack = [];
    while (is_cons(p3)) {
        // for a general transformations,
        // we want to match any part of the tree so
        // we need to push the subtree as well
        // as recurse to its parts
        if (generalTransform) {
            stack.push(car(p3));
        }

        stack.push(...decomp(generalTransform, car(p3), p2, $));
        p3 = cdr(p3);
    }
    return stack;
}

function decomp_sum(generalTransform: boolean, p1: U, p2: U, $: ExtensionEnv): U[] {
    // decomp terms involving x
    let temp: U = cdr(p1);
    const stack = [];
    while (is_cons(temp)) {
        if (car(temp).contains(p2) || generalTransform) {
            stack.push(...decomp(generalTransform, car(temp), p2, $));
        }
        temp = cdr(temp);
    }

    // add together all constant terms
    const constantPart = assert_cons_or_nil(cdr(p1));
    const constantTerms = [...constantPart].filter((t) => !t.contains(p2));
    if (constantTerms.length) {
        const p3 = add_terms(constantTerms, $);
        pushTryNotToDuplicateLocal(stack, p3);
        stack.push($.negate(p3)); // need both +a, -a for some integrals
    }
    return stack;
}

function decomp_product(generalTransform: boolean, p1: U, p2: U, $: ExtensionEnv): U[] {
    // decomp factors involving x
    let p3: U = cdr(p1);
    const stack = [];
    while (is_cons(p3)) {
        if (car(p3).contains(p2) || generalTransform) {
            stack.push(...decomp(generalTransform, car(p3), p2, $));
        }
        p3 = cdr(p3);
    }

    // multiply together all constant factors
    p3 = cdr(p1);

    const constantFactors: U[] = [];
    while (is_cons(p3)) {
        const item = car(p3);
        if (!item.contains(p2)) {
            if (
                constantFactors.length < 1 ||
                !item.equals(constantFactors[constantFactors.length - 1])
            ) {
                constantFactors.push(item);
            }
        }
        p3 = cdr(p3);
    }

    if (constantFactors.length > 0) {
        stack.push(multiply_items(constantFactors, $));
    }
    return stack;
}
