import { compare_num_num } from '../../calculators/compare/compare_num_num';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { guess } from '../../guess';
import { is_num } from '../num/is_num';
import { is_power } from '../../runtime/helpers';
import { caddr, cadr } from '../../tree/helpers';
import { Num } from '../../tree/num/Num';
import { one, zero } from '../../tree/rat/Rat';
import { Cons, is_cons, nil, U } from '../../tree/tree';

/* deg =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
p,x

General description
-------------------
Returns the degree of polynomial p(x).

*/
export function Eval_degree(degreeInvoke: Cons, $: ExtensionEnv): U {
    const p1 = $.valueOf(caddr(degreeInvoke));
    const top = $.valueOf(cadr(p1));
    const variable = nil.equals(p1) ? guess(top) : p1;
    return degree(top, variable, $);
}

//-----------------------------------------------------------------------------
//
//  Find the degree of a polynomial
//
//  Input:    POLY    p(x)
//            X       x
//
//  Output:    Result
//
//  Note: Finds the largest numerical power of x. Does not check for
//  weirdness in p(x).
//
//-----------------------------------------------------------------------------
export function degree(P: U, X: U, $: ExtensionEnv): U {
    return yydegree(P, X, zero, $);
}

function yydegree(P: U, X: U, d: Num, $: ExtensionEnv): Num {
    if (P.equals(X)) {
        if ($.iszero(d)) {
            return one;
        }
        else {
            return d;
        }
    }
    else if (is_cons(P) && is_power(P)) {
        // It's not obvious in the following that we are looking at the base and exponent.
        // A match on (expt base exponent) would make this clearer.
        const caddr_poly = caddr(P);
        if ($.equals(cadr(P), X) && is_num(caddr_poly) && compare_num_num(d, caddr_poly) < 0) {
            return caddr_poly;
        }
        else {
            return d;
        }
    }
    else if (is_cons(P)) {
        return P.tail().reduce(function (prev: Num, curr: U) {
            return yydegree(curr, X, prev, $);
        }, d);
    }
    else {
        return d;
    }
}
