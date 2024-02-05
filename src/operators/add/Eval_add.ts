import { is_blade } from "math-expression-atoms";
import { assert_cons_or_nil } from "math-expression-tree";
import { add_num_num } from "../../calculators/add/add_num_num";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { canonical_factor_num_rhs } from "../../calculators/factorize/canonical_factor_num";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_add, is_multiply } from "../../runtime/helpers";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { one, zero } from "../../tree/rat/Rat";
import { car, cdr, cons, Cons, is_nil, items_to_cons, U } from "../../tree/tree";
import { compare_blade_blade } from "../blade/blade_extension";
import { evaluate_as_float } from "../float/float";
import { is_flt } from "../flt/is_flt";
import { is_num } from "../num/is_num";
import { is_tensor } from "../tensor/is_tensor";
import { add_tensor_tensor } from "../tensor/tensor_extension";

const ADD = native_sym(Native.add);

export function Eval_add(expr: Cons, $: ExtensionEnv): U {
    // console.lg("Eval_add", $.toInfixString(expr));
    const args = expr.argList;
    const vals = args.map($.valueOf);
    return add_values(vals, expr, $);
}

export function add_values(vals: Cons, expr: Cons, $: ExtensionEnv): U {
    const args = expr.argList;
    if (vals.equals(args)) {
        const terms: U[] = [];
        const values = [...vals];
        const some_term_is_zero_float = values.some((term) => is_flt(term) && term.isZero());
        if (some_term_is_zero_float) {
            for (const value of values) {
                push_terms(terms, evaluate_as_float(value, $), $);
            }
        }
        else {
            for (const value of values) {
                push_terms(terms, $.valueOf(value), $);
            }
        }
        return add_terms(terms, $);
    }
    else {
        // Evaluation of the arguments has produced changes so we give other operators a chance to evaluate.
        return $.add(...vals);
    }
}

/**
 * Pushes a term onto the terms array with side effects that association is removed and zeros are omitted. 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function push_terms(terms: U[], term: U, $: ExtensionEnv): void {
    if (is_add(term)) {
        terms.push(...term.tail());
    }
    else if (is_num(term) && term.isZero()) {
        // omit zeros
        // console.lg("omitting", $.toInfixString(term));
    }
    else {
        terms.push(term);
    }
}

function add_terms(terms: U[], $: ExtensionEnv): U {
    /**
     * The canonical comparator function for comparing terms.
     */
    const cmp_terms = $.compareFn(ADD);

    // ensure no infinite loop, use "for"
    for (let i = 0; i < 10; i++) {
        if (terms.length < 2) {
            break;
        }

        let flag = 0;

        const compareFn = function (rawL: U, rawR: U): Sign {
            if (is_num(rawL) && is_num(rawR)) {
                // Num(s) can be combined.
                flag = 1;
                return SIGN_EQ;
            }
            // We make sure that terms differing only in numerical factors can be combined.
            // We don't assume that the canonical addition comparator will return SIGN_EQ
            // if the numerical factors are the same (even though this might be reasonable).
            const lhs = canonical_factor_num_rhs(rawL);
            const rhs = canonical_factor_num_rhs(rawR);

            if (is_tensor(lhs) && is_tensor(rhs)) {
                if (lhs.ndim < rhs.ndim) {
                    return SIGN_LT;
                }
                if (lhs.ndim > rhs.ndim) {
                    return SIGN_GT;
                }
                const rank = lhs.ndim;
                for (let i = 0; i < rank; i++) {
                    if (lhs.dim(i) < rhs.dim(i)) {
                        return SIGN_LT;
                    }
                    if (lhs.dim(i) > rhs.dim(i)) {
                        return SIGN_GT;
                    }
                }
                flag = 1;
                return SIGN_EQ;
            }

            if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
                const bladeL = extract_single_blade(lhs);
                const bladeR = extract_single_blade(rhs);
                switch (compare_blade_blade(bladeL, bladeR)) {
                    case SIGN_LT: {
                        return SIGN_LT;
                    }
                    case SIGN_GT: {
                        return SIGN_GT;
                    }
                    default: {
                        switch (cmp_terms(remove_factors(lhs, is_blade), remove_factors(rhs, is_blade))) {
                            case SIGN_LT: {
                                return SIGN_LT;
                            }
                            case SIGN_GT: {
                                return SIGN_GT;
                            }
                            case SIGN_EQ: {
                                // We have terms containing a single common blade that can be combined.
                                flag = 1;
                                return SIGN_EQ;
                            }
                        }
                    }
                }
            }

            const sign = cmp_terms(lhs, rhs);
            // console.lg("sign", sign);
            if (sign === SIGN_EQ) {
                // TODO: How would we end up here?
                flag = 1;
            }
            return sign;
        };

        // console.lg("sorting terms");

        terms.sort(compareFn);

        if (flag === 0) {
            break;
        }

        combine_terms(terms, $);
    }

    switch (terms.length) {
        case 0: {
            // We are assuming here that any zeros that were thrown away were Rat(s).
            // But we may have thrown away a float.
            // console.lg("terms are empty, returning a Rat");
            return zero;
        }
        case 1: {
            return terms[0];
        }
        default: {
            terms.unshift(ADD);
            return items_to_cons(...terms);
        }
    }
}

function combine_terms(terms: U[], $: ExtensionEnv): void {
    let addedZeroAsFlt = false;
    let i = 0;
    while (i < terms.length - 1) {
        let lhs = terms[i];
        let rhs = terms[i + 1];

        if (is_tensor(lhs) && is_tensor(rhs)) {
            const sum = add_tensor_tensor(lhs, rhs, $);
            if (!is_nil(sum)) {
                terms.splice(i, 2, sum);
                i--;
            }

            i++;
            continue;
        }

        if (is_tensor(lhs) || is_tensor(rhs)) {
            i++;
            continue;
        }

        if (is_num(lhs) && is_num(rhs)) {
            const sum = add_num_num(lhs, rhs);
            if (sum.isZero()) {
                // At this point we are in danger of forgetting if the zero was a Flt (as opposed to a Rat).
                // If there are exactly two terms, keep the sum as a zero with a particular type.
                // console.lg("terms.length", terms.length);
                if (terms.length === 2) {
                    terms.splice(i, 2, sum);
                }
                else {
                    if (is_flt(sum)) {
                        addedZeroAsFlt = true;
                    }
                    terms.splice(i, 2);
                }
            }
            else {
                terms.splice(i, 2, sum);
            }
            i--;

            i++;
            continue;
        }

        if (is_num(lhs) || is_num(rhs)) {
            i++;
            continue;
        }

        let p1: U = one;
        let p2: U = one;

        let t = 0;

        if (is_multiply(lhs)) {
            lhs = cdr(lhs);
            t = 1; // p3 is now denormal
            if (is_num(car(lhs))) {
                p1 = car(lhs);
                lhs = cdr(lhs);
                if (is_nil(cdr(lhs))) {
                    lhs = car(lhs);
                    t = 0;
                }
            }
        }

        if (is_multiply(rhs)) {
            rhs = cdr(rhs);
            if (is_num(car(rhs))) {
                p2 = car(rhs);
                rhs = cdr(rhs);
                if (is_nil(cdr(rhs))) {
                    rhs = car(rhs);
                }
            }
        }

        if (!lhs.equals(rhs)) {
            i++;
            continue;
        }

        p1 = add_num_num(p1 as Num, p2 as Num);

        if (is_num_or_tensor_and_zero(p1, $)) {
            terms.splice(i, 2);
            i--;

            i++;
            continue;
        }

        const arg2 = t ? cons(MATH_MUL, assert_cons_or_nil(lhs)) : lhs;

        terms.splice(i, 2, $.multiply(p1, arg2));
        i--;

        // this i++ is to match the while
        i++;
    }
    if (addedZeroAsFlt) {
        for (let i = 0; i < terms.length; i++) {
            terms[i] = $.float(terms[i]);
        }
    }
}

function is_num_or_tensor_and_zero(expr: U, $: ExtensionEnv): boolean {
    return is_num_and_zero(expr) || is_tensor_and_zero(expr, $);
}

function is_num_and_zero(expr: U): boolean {
    return is_num(expr) && expr.isZero();
}

function is_tensor_and_zero(expr: U, $: ExtensionEnv): boolean {
    // TODO: We can see here that we could simply as if the term is zero.
    return is_tensor(expr) && $.iszero(expr);
}
