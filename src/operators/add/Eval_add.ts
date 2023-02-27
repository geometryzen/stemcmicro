import { add_num_num } from "../../calculators/add/add_num_num";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { canonical_factor_num_rhs } from "../../calculators/factorize/canonical_factor_num";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_add, is_multiply } from "../../runtime/helpers";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { one, zero } from "../../tree/rat/Rat";
import { car, cdr, cons, Cons, is_nil, items_to_cons, U } from "../../tree/tree";
import { compare_blade_blade } from "../blade/blade_extension";
import { is_blade } from "../blade/is_blade";
import { is_num } from "../num/is_num";
import { is_tensor } from "../tensor/is_tensor";
import { add_tensor_tensor } from "../tensor/tensor_extension";

export function Eval_add(expr: Cons, $: ExtensionEnv): U {
    const terms: U[] = [];
    const argList = expr.argList;
    for (const term of argList) {
        push_terms(terms, $.valueOf(term));
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
        // omit zeros
    }
    else {
        terms.push(term);
    }
}

function add_terms(terms: U[], $: ExtensionEnv): U {
    // console.lg("add_terms");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    terms.forEach(function (term) {
        // console.lg("term", render_as_infix(term, $));
    });

    /**
     * The canonical comparator function for comparing terms.
     */
    const cmp_terms = $.compareFn(MATH_ADD);

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
        case 0:
            return zero;
        case 1:
            return terms[0];
        default:
            terms.unshift(MATH_ADD);
            return items_to_cons(...terms);
    }
}

function combine_terms(terms: U[], $: ExtensionEnv): void {
    // console.lg("combine_terms");
    // I had to turn the coffeescript for loop into
    // a more mundane while loop because the i
    // variable was changed from within the body,
    // which is something that is not supposed to
    // happen in the coffeescript 'vector' form.
    // Also this means I had to add a 'i++' jus before
    // the end of the body and before the "continue"s
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
            if (is_num_or_tensor_and_zero(sum, $)) {
                terms.splice(i, 2);
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

        const arg2 = t ? cons(MATH_MUL, lhs) : lhs;

        terms.splice(i, 2, $.multiply(p1, arg2));
        i--;

        // this i++ is to match the while
        i++;
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
    return is_tensor(expr) && $.isZero(expr);
}
