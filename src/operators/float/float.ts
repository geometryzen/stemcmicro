import { is_rat, is_tensor, Tensor } from 'math-expression-atoms';
import { Cons, is_cons, items_to_cons, U } from 'math-expression-tree';
import { rat_to_flt } from '../../bignum';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { eAsFlt, Flt, piAsFlt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { is_pi } from '../pi/is_pi';

export function eval_float(expr: Cons, $: ExtensionEnv): U {
    // console.lg("eval_float", $.toInfixString(expr));
    const A = cadr(expr);
    // console.lg("A", $.toInfixString(A));
    const B = $.valueOf(A);
    // console.lg("B", $.toInfixString(B));
    const C = evaluate_as_float(B, $);
    // console.lg("C", $.toInfixString(C));
    const D = $.valueOf(C);
    // console.lg("D", $.toInfixString(D));
    return D;
}

/**
 * An interpretation of the "zz" is that the expression must be evaluated before it is processed and it will be evaluated after.
 * @param expr 
 * @param $ 
 * @returns 
 */
export function zzfloat(expr: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.evaluatingAsFloat, 1);
    try {
        return $.valueOf(evaluate_as_float($.valueOf(expr), $));
    }
    finally {
        $.popDirective();
    }
}

/**
 * coercion of the expr to a Flt, Tensor<Flt> etc.
 */
export function evaluate_as_float(expr: U, $: Pick<ExtensionEnv, 'pushDirective' | 'popDirective' | 'valueOf'>): U {
    // console.lg(`yyfloat`, render_as_sexpr(expr, $));
    $.pushDirective(Directive.evaluatingAsFloat, 1);
    try {
        return yyfloat_(expr, $);
    }
    finally {
        $.popDirective();
    }
}

function yyfloat_(expr: U, $: Pick<ExtensionEnv, 'valueOf'>): Flt | Cons | Tensor | U {
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
