import { rat_to_flt } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { evaluatingAsFloat } from '../../modes/modes';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { eAsFlt, Flt, piAsFlt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { Tensor } from '../../tree/tensor/Tensor';
import { Cons, is_cons, items_to_cons, U } from '../../tree/tree';
import { is_pi } from '../pi/is_pi';
import { is_rat } from '../rat/is_rat';
import { is_tensor } from '../tensor/is_tensor';

export function Eval_float(expr: Cons, $: ExtensionEnv): U {
    // console.lg("Eval_float", render_as_infix(expr, $));
    // console.lg("Eval_float", render_as_sexpr(expr, $));
    const mode = $.getModeFlag(evaluatingAsFloat);
    $.setModeFlag(evaluatingAsFloat, true);
    try {
        const A = cadr(expr);
        // console.lg("A", render_as_infix(A, $), JSON.stringify(A));
        if (is_base_of_natural_logarithm(A)) {
            // console.lg("A is the base of natural logs.");
        }
        if (is_pi(A)) {
            // console.lg("A is pi");
        }
        const B = $.valueOf(A);
        // console.lg("B", render_as_infix(B, $));
        const C = evaluate_as_float(B, $);
        // console.lg("C", render_as_infix(C, $));
        const D = $.valueOf(C);
        // console.lg("D", render_as_infix(D, $));
        return D;
    }
    finally {
        $.setModeFlag(evaluatingAsFloat, mode);
    }
}

export function zzfloat(p1: U, $: ExtensionEnv): U {
    const mode = $.getModeFlag(evaluatingAsFloat);
    $.setModeFlag(evaluatingAsFloat, true);
    try {
        return $.valueOf(evaluate_as_float($.valueOf(p1), $));
    }
    finally {
        $.setModeFlag(evaluatingAsFloat, mode);
    }
}
// zzfloat doesn't necessarily result in a double
// , for example if there are variables. But
// in many of the tests there should be indeed
// a float, this line comes handy to highlight
// when that doesn't happen for those tests.
// checkFloatHasWorkedOutCompletely(defs.stack[defs.tos-1],$)

export function evaluate_as_float(expr: U, $: ExtensionEnv): U {
    // console.lg(`yyfloat`, render_as_sexpr(expr, $));
    const mode = $.getModeFlag(evaluatingAsFloat);
    $.setModeFlag(evaluatingAsFloat, true);
    try {
        return yyfloat_(expr, $);
    }
    finally {
        $.setModeFlag(evaluatingAsFloat, mode);
    }
}

function yyfloat_(expr: U, $: ExtensionEnv): Flt | Cons | Tensor | U {
    // console.lg(`yyfloat_`, $.toSExprString(expr));
    if (is_cons(expr)) {
        return $.valueOf(items_to_cons(...expr.map(function (x) {
            return yyfloat_(x, $);
        })));
    }
    if (is_tensor(expr)) {
        return expr.map(function (x) {
            return yyfloat_(x, $);
        });
    }
    if (is_rat(expr)) {
        return rat_to_flt(expr);
    }
    if (is_pi(expr)) {
        return piAsFlt;
    }
    if (is_base_of_natural_logarithm(expr)) {
        return eAsFlt;
    }
    return expr;
}
