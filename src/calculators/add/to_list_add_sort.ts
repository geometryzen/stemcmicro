import { ExtensionEnv } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { is_num } from "../../predicates/is_num";
import { defs } from "../../runtime/defs";
import { is_multiply } from "../../runtime/helpers";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { is_tensor } from "../../tree/tensor/is_tensor";
import { Num } from "../../tree/num/Num";
import { one, zero } from "../../tree/rat/Rat";
import { car, cdr, cons, is_cons, NIL, U } from "../../tree/tree";
import { multiply_num_num } from "../mul/multiply_num_num";
import { sort_terms } from "../compare/sort_terms";
import { add_num_num } from "./add_num_num";

export function to_list_add_sort(terms: U[], $: ExtensionEnv): U {
    const sorted = sort_terms(terms, $);
    return to_list_add(sorted, $);
}

/**
 * Compare adjacent terms in terms[] and combine if possible.
 * @param terms The terms to be combined and the output location.
 */
function to_list_add(terms: U[], $: ExtensionEnv): U {
    // console.lg(`to_list_add ${items_to_infix(terms, $)}`);
    let i = 0;
    let typedZero: Num = zero;
    // The general idea is that we are going to take the terms in adjacent pairs
    // and try to combine them. If we can, we'll splice out the two terms and
    // replace them with a single term.
    while (i < terms.length - 1) {
        const a = terms[i];
        const b = terms[i + 1];

        // TODO: Generalize here after understanding the issues for Mat and Num
        if (is_tensor(a) && is_tensor(b)) {
            const sum = $.add(a, b);
            // TODO: Why don't we handle zero like we do for Num below?
            if (NIL !== sum) {
                // console.lg(`A. splice(${sum34})`);
                terms.splice(i, 2, sum);
                i--;
            }

            i++;
            continue;
        }

        if (is_tensor(a) || is_tensor(b)) {
            // TODO: I'm not sure why we give up here.
            // Seems like we could try the simplification below.
            i++;
            continue;
        }

        if (defs.evaluateVersion < 3) {
            if (is_num(a) && is_num(b)) {
                const sum = add_num_num(a, b);
                if ($.isZero(sum)) {
                    // Ensure correct runtime type of the result by propagating the type correctly.
                    typedZero = multiply_num_num(typedZero, sum);
                    terms.splice(i, 2);
                }
                else {
                    terms.splice(i, 2, sum);
                }
                // TODO: This looks wierd compared to the matrix case. 
                i--;

                i++;
                continue;
            }

            if (is_num(a) || is_num(b)) {
                i++;
                continue;
            }
        }

        const decomp_a = decompose_multiply_num_times(a);
        const is_list_s = decomp_a.denorm;
        const lhs_a = decomp_a.lhs;
        const rhs_a = decomp_a.rhs;

        const decomp_b = decompose_multiply_num_times(b);
        const lhs_b = decomp_b.lhs;
        const rhs_b = decomp_b.rhs;

        if (!$.equals(rhs_a, rhs_b)) {
            // No common factor on right.
            i++;
            continue;
        }

        // If we are here then rhs_a = rhs_b there is a common factor on the right.
        // sum(a,b) = (lhs_a + rhs_a) * common factor on right = k * common factor on the right.
        const k = add_num_num(lhs_a, lhs_b);

        // If k is zero then (a + b) is zero.
        if ($.isZero(k)) {
            terms.splice(i, 2);
            i--;

            i++;
            continue;
        }

        // If we are here then k is not zero.
        /**
         * the common factor on the right of both a and b.
         * 
         * sum(a, b) = k * s, where s could be a single node or a list of nodes
         */
        const ambiguous_s = rhs_a;
        const s = is_list_s ? cons(MATH_MUL, ambiguous_s) : ambiguous_s;
        const sum_a_b = $.multiply(k, s);
        // console.lg(`E. splice(${sum12xArg2})`);
        terms.splice(i, 2, sum_a_b);
        i--;

        // this i++ is to match the while
        i++;
    }
    if (terms.length > 0) {
        if (terms.length > 1) {
            // console.lg(`terms => ${items_to_infix(terms, $)}`)
            return cons(MATH_ADD, makeList(...terms));
        }
        else {
            return terms[0];
        }
    }
    else {
        return typedZero;
    }
}

/**
 * Decomposes an expression according to the following patterns.
 * 
 * Notice that lhs * rhs is an invariant equal to the original expression.
 * 
 * expr                          denorm  lhs   rhs
 *
 * (multiply a1: Num a2)         false   a1    a2
 * 
 * (multiply a1: Num a2 a3 ...)  true    a1    (a2 a3 ...)
 * 
 * (multiply a1 a2 a3 ...)       true    1     (a1 a2 a3 ...)
 * 
 * expr                          false   1     expr                
 */
function decompose_multiply_num_times(expr: U): { denorm: boolean, lhs: Num, rhs: U } {
    if (is_cons(expr) && is_multiply(expr)) {
        // (multiply a1 a2 a3 a4 ...)
        /**
         * (a1 a2 a3 a4 ...) or NIL
         */
        const cdr_expr = expr.cdr;
        /**
         * a1 or NIL
         */
        const a1 = car(cdr_expr);
        if (is_num(a1)) {
            /**
             * (a2 a3 a4 ...) or NIL
             */
            const cddr_expr = cdr(cdr_expr);
            /**
             * (a3 a4 ...) or NIL
             */
            const cdddr_expr = cdr(cddr_expr);
            if (NIL === cdddr_expr) {
                // (multiply a1: Num a2)
                /**
                 * a2 = caddr_expr
                 */
                const a2 = car(cddr_expr);
                return { denorm: false, lhs: a1, rhs: a2 };
            }
            else {
                // (multiply a1: Num a2 a3 ...)
                return { denorm: true, lhs: a1, rhs: cddr_expr };
            }
        }
        else {
            // a1 is anything
            // (multiply a1 a2 a3 ...)
            return { denorm: true, lhs: one, rhs: cdr_expr };
        }
    }
    else {
        // Not a multiply
        return { denorm: false, lhs: one, rhs: expr };
    }
}

