import { compare_terms } from '../../calculators/compare/compare_terms';
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { ADD } from "../../runtime/constants";
import { is_add } from "../../runtime/helpers";
import { MATH_ADD } from "../../runtime/ns_math";
import { cadr, cddr } from "../../tree/helpers";
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
        // console.lg(this.name, render_as_infix(expr, this.$));
        const $ = this.$;
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
            const terms = foo_terms(expr, $);
            const sorted = items_to_cons(expr.head, ...terms.sort(make_term_comparator($)));
            if (sorted.equals(expr)) {
                return [TFLAG_NONE, hook('D', expr)];
            }
            else {
                const terms = add_term_pairs(sorted.tail(), $);
                return [TFLAG_DIFF, hook('E', items_to_cons(expr.head, ...terms))];
            }
        }
        else {
            // console.lg("ADD", render_as_infix(expr, $));
            return [TFLAG_NONE, hook('F', expr)];
        }
    }
}

function foo_terms(expr: Cons, $: ExtensionEnv): U[] {
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

function add_term_pairs(terms: U[], $: ExtensionEnv): U[] {
    const retval: U[] = [...terms];
    let i = 0;
    while (i < retval.length - 1) {
        const lhs = retval[i];
        const rhs = retval[i + 1];
        const s = $.valueOf(add(lhs, rhs, $));
        if (is_term_pair_changed(s, lhs, rhs)) {
            retval.splice(i, 2, s);
        }
        else {
            i++;
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
