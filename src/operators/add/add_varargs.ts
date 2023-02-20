import { add_num_num } from '../../calculators/add/add_num_num';
import { compare_terms } from '../../calculators/compare/compare_terms';
import { canonical_factor_num_lhs, canonical_factor_num_rhs } from '../../calculators/factorize/canonical_factor_num';
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { ADD } from "../../runtime/constants";
import { is_add } from "../../runtime/helpers";
import { MATH_ADD } from "../../runtime/ns_math";
import { cadr, cddr } from "../../tree/helpers";
import { zero } from '../../tree/rat/Rat';
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_add_2_any_any } from './is_add_2_any_any';

const make_term_comparator = function ($: ExtensionEnv) {
    return function (a: U, b: U) {
        return compare_terms(a, b, $);
    };
};

const make_add_reduce_callback = function ($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (previousValue: U, currentValue: U, currentIndex: number, array: U[]) {
        return add(previousValue, $.valueOf(currentValue), $);
    };
};

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_varargs', ADD, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        // console.lg(this.name, decodeMode($.getMode()), render_as_sexpr(expr, this.$));
        const hook = (where: string, retval: U): U => {
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_infix(expr, this.$), "=>", render_as_infix(retval, $));
            return retval;
        };
        if ($.isExplicating()) {
            // console.lg("EXPLICATING", render_as_infix(expr, $));
            const retval = explicate(expr, $);
            if (retval.equals(expr)) {
                return [TFLAG_NONE, hook('A', expr)];
            }
            else {
                return [TFLAG_DIFF, hook('B', retval)];
            }

        }
        else if ($.isImplicating()) {
            // console.lg("IMPLICATING", render_as_infix(expr, $));
            return [TFLAG_NONE, hook('C', expr)];
        }
        else if ($.isExpanding()) {
            // console.lg("EXPANDING", render_as_infix(expr, $));
            const terms = make_term_association_implicit(expr, $);
            // TODO: Handling of zero and one term.
            if (terms.length === 0) {
                // We simplify the nonary case. (*) => 1 (the identity element for multiplication)
                return [TFLAG_DIFF, hook('D', zero)];
            }
            if (terms.length === 1) {
                // We simplify the unary case. (* a) => a
                return [TFLAG_DIFF, hook('E', terms[0])];
            }
            const sorted = items_to_cons(expr.head, ...terms.sort(make_term_comparator($)));
            if (sorted.equals(expr)) {
                // We have to try to add them together, but there is potential for infinite loop
                const terms = add_term_pairs(sorted.tail(), expr, $);
                const retval = items_to_cons(expr.head, ...terms);
                return [TFLAG_DIFF, hook('F', retval)];
            }
            else {
                const terms = add_term_pairs(sorted.tail(), expr, $);
                return [TFLAG_DIFF, hook('G', items_to_cons(expr.head, ...terms))];
            }
        }
        else {
            // console.lg("ADD", render_as_infix(expr, $));
            return [TFLAG_NONE, hook('H', expr)];
        }
    }
}

function make_term_association_implicit(expr: Cons, $: ExtensionEnv): U[] {
    const terms = expr.tail();
    if ($.isAssociationImplicit()) {
        if (terms.some((term => is_cons(term) && is_add(term)))) {
            const args: U[] = [];
            for (const term of terms) {
                if (is_cons(term) && is_add(term)) {
                    args.push(...term.tail());
                }
                else {
                    args.push(term);
                }
            }
            return args;
        }
        else {
            return terms;
        }
    }
    return terms;
}

/**
 * 
 * @param terms 
 * @param original Use to prevent infinite recursion. 
 * @param $ 
 * @returns 
 */
function add_term_pairs(terms: U[], original: U, $: ExtensionEnv): U[] {
    const retval: U[] = [...terms];
    let i = 0;
    while (i < retval.length - 1) {
        const lhs = retval[i];
        const rhs = retval[i + 1];
        const lhsRem = $.valueOf(canonical_factor_num_rhs(lhs));
        const rhsRem = $.valueOf(canonical_factor_num_rhs(rhs));
        // console.lg("lhs", render_as_sexpr(lhs, $));
        // console.lg("lhsNum", render_as_infix(lhsNum, $));
        // console.lg("lhsRem", render_as_sexpr(lhsRem, $));
        // console.lg("rhs", render_as_sexpr(rhs, $));
        // console.lg("rhsNum", render_as_infix(rhsNum, $));
        // console.lg("rhsRem", render_as_sexpr(rhsRem, $));
        if (lhsRem.equals(rhsRem)) {
            const lhsNum = canonical_factor_num_lhs(lhs);
            const rhsNum = canonical_factor_num_lhs(rhs);
            const s = $.multiply(add_num_num(lhsNum, rhsNum), lhsRem);
            retval.splice(i, 2, s);
        }
        else {
            const lhsNum = canonical_factor_num_lhs(lhs);
            const rhsNum = canonical_factor_num_lhs(rhs);
            // console.lg("lhsNum", render_as_infix(lhsNum, $));
            // console.lg("rhsNum", render_as_infix(rhsNum, $));
            if (lhsNum.equals(rhsNum)) {
                // We try to recruit some other pattern matcher to transform the addition.
                // The problem is that we end up finding ourself and end up in an infinite loop.
                const candidate = items_to_cons(MATH_ADD, lhsRem, rhsRem);
                if (candidate.equals(original)) {
                    // Attempting to evaluate the expression would lead to infinite recursion.
                    i++;
                }
                else {
                    const s = $.valueOf(candidate);
                    if (is_term_pair_changed(s, lhsRem, rhsRem)) {
                        // console.lg(`CHANGE`);
                        retval.splice(i, 2, $.multiply(lhsNum, s));
                    }
                    else {
                        // console.lg(`SAME`);
                        i++;
                    }
                }
            }
            else {
                i++;
            }
        }
    }
    return retval;
}

function is_term_pair_changed(s: U, lhs: U, rhs: U): boolean {
    if (is_cons(s) && is_add_2_any_any(s)) {
        if (s.item(1).equals(lhs) && s.item(2).equals(rhs)) {
            return false;
        }
        else if (s.item(1).equals(rhs) && s.item(2).equals(lhs)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function explicate(expr: Cons, $: ExtensionEnv): U {
    let retval = $.valueOf(cadr(expr));
    const remainder = cddr(expr);
    if (is_cons(remainder)) {
        const callbackfn = make_add_reduce_callback($);
        const initialValue = retval;
        const items: U[] = [...remainder];
        retval = items.reduce(callbackfn, initialValue);
    }
    return retval;
}

function add(argL: U, argR: U, $: ExtensionEnv): U {
    // console.lg("add", render_as_infix(argL, $), render_as_infix(argR, $));
    if ($.isExpanding()) {
        if (is_add(argL)) {
            // console.lg("// We would like to flatten and sort.");
        }
        if (is_add(argR)) {
            // console.lg("// We would like to flatten and sort.");
        }
    }
    return items_to_cons(MATH_ADD, argL, argR);
}

export const add_varargs = new Builder();
