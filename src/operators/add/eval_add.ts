import { create_sym, is_blade, is_flt, is_num, is_tensor, Num, one, zero } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { assert_cons_or_nil, car, cdr, cons, Cons, is_atom, is_nil, items_to_cons, U } from "math-expression-tree";
import { add_num_num } from "../../calculators/add/add_num_num";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { canonical_factor_num_rhs } from "../../calculators/factorize/canonical_factor_num";
import { remove_factors } from "../../calculators/remove_factors";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { dispatch_eval_varargs } from "../../dispatch/dispatch_eval_varargs";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { float } from "../../helpers/float";
import { multiply } from "../../helpers/multiply";
import { is_add, is_multiply } from "../../runtime/helpers";
import { MATH_MUL } from "../../runtime/ns_math";
import { compare_blade_blade } from "../blade/blade_extension";
import { evaluate_as_float } from "../float/float";
import { add_tensor_tensor } from "../tensor/tensor_extension";

const ADD = native_sym(Native.add);

export function eval_add(expr: Cons, env: ExprContext): U {
    return dispatch_eval_varargs(expr, add_values, env);
}

function add_values(vals: Cons, $: ExprContext): U {
    const terms: U[] = [];
    const values = [...vals];
    const some_term_is_zero_float = values.some((term) => is_flt(term) && term.isZero());
    if (some_term_is_zero_float) {
        for (const value of values) {
            push_terms(terms, evaluate_as_float(value, $));
        }
    }
    else {
        for (const value of values) {
            push_terms(terms, $.valueOf(value));
        }
    }
    return add_terms(terms, $);
}

/**
 * Pushes a term onto the terms array with side effects that association is removed and zeros are omitted. 
 */
function push_terms(terms: U[], term: U): void {
    if (is_add(term)) {
        terms.push(...term.tail());
    }
    else if (is_num(term) && term.isZero()) {
        // omit Flt and Rat zeros.
        // Tensors are retained because they shape the result.
        // Flt can be dropped because the remaining terms were evaluated as floats. 
    }
    else {
        terms.push(term);
    }
}

function add_terms(terms: U[], $: ExprContext): U {
    /*
    console.lg("add_terms");
    for (let i = 0; i < terms.length; i++) {
        console.lg(`terms[${i}] => `, $.toInfixString(terms[i]));
    }
    */
    /**
     * The canonical comparator function for comparing terms.
     */
    const cmp_terms = $.compareFn(ADD);

    // ensure no infinite loop, use "for"
    // TODO: This amounts to sorting the terms, combining what we can, and doing so until stable.
    // combine_terms could indicate whether changes occurred.
    for (let i = 0; i < 10; i++) {
        if (terms.length < 2) {
            break;
        }

        let flag = 0;

        // This code is a bit crazy. It is used to both sort the terms AND to determine
        // whether terms can be combined. If terms can be combined then the flag variable
        // 
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
            // No terms can be combined.
            // TODO: Let's ignore this for now...
            // break;
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

function combine_terms(terms: U[], $: ExprContext): void {
    let addedZeroAsFlt = false;
    let i = 0;
    while (i < terms.length - 1) {
        let lhs = terms[i];
        let rhs = terms[i + 1];

        if (is_atom(lhs) && is_atom(rhs)) {
            const lhsExt = $.handlerFor(lhs);    // Assume that for atoms an extension can be found.
            const rhsExt = $.handlerFor(rhs);    // Assume that for atoms an extension can be found.
            // console.lg("combine_atoms", `${lhs}`, `${rhs}`, `${lhsExt}`, `${rhsExt}`, `${lhs.type}`, `${rhs.type}`);
            const sumLhs = lhsExt.binL(lhs, ADD, rhs, $);
            if (is_nil(sumLhs)) {
                const sumRhs = rhsExt.binR(rhs, ADD, lhs, $);
                if (is_nil(sumRhs)) {
                    const err = diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, ADD, create_sym(lhs.type), create_sym(rhs.type));
                    terms.splice(i, 2, err);
                    continue;
                }
                else {
                    if (is_add(sumRhs)) {
                        // Ignore.
                    }
                    else {
                        terms.splice(i, 2, sumRhs);
                        continue;
                    }
                }
            }
            else {
                if (is_add(sumLhs)) {
                    // Ignore.
                }
                else {
                    terms.splice(i, 2, sumLhs);
                    continue;
                }
            }
        }

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

        terms.splice(i, 2, multiply($, p1, arg2));
        i--;

        // this i++ is to match the while
        i++;
    }
    if (addedZeroAsFlt) {
        for (let i = 0; i < terms.length; i++) {
            terms[i] = float(terms[i], $);
        }
    }
}

function is_num_or_tensor_and_zero(expr: U, env: ExprContext): boolean {
    // console.lg("is_num_or_tensor_and_zero", `${expr}`);
    return is_num_and_zero(expr) || is_tensor_and_zero(expr, env);
}

function is_num_and_zero(expr: U): boolean {
    return is_num(expr) && expr.isZero();
}

function is_tensor_and_zero(expr: U, env: ExprContext): boolean {
    if (is_tensor(expr)) {
        const handler = env.handlerFor(expr);
        return handler.test(expr, native_sym(Native.zero), env);
    }
    else {
        return false;
    }
}
