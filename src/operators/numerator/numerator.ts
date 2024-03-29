import { ExprContext } from 'math-expression-context';
import { mp_numerator } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { isone } from '../../helpers/isone';
import { multiply_items } from '../../multiply';
import { is_negative } from '../../predicates/is_negative';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { caddr } from '../../tree/helpers';
import { one } from '../../tree/rat/Rat';
import { car, cdr, Cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { rationalize_factoring } from '../rationalize/rationalize';

export function eval_numerator(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            // console.lg("eval_numerator", "head", `${$.toInfixString(head)}`);
            const arg = $.valueOf(head);
            try {
                // console.lg("eval_numerator", "arg", `${$.toInfixString(arg)}`);
                return numerator(arg, $);
            }
            finally {
                arg.release();
            }
        }
        finally {
            head.release();
        }
    }
    finally {
        argList.release();
    }
}

export function numerator(p1: U, $: Pick<ExprContext, 'handlerFor' | 'pushDirective' | 'popDirective' | 'valueOf'>): U {
    // console.lg("numerator", `${p1}`);
    if (is_add(p1)) {
        //console.trace "rationalising "
        p1 = rationalize_factoring(p1, $);
        // console.lg("rationalized", `${p1}`);
    }
    // console.lg(`rationalized=${$.toInfixString(p1)}`);
    // console.lg(`rationalized=${$.toSExprString(p1)}`);

    if (is_multiply(p1) && !isone(car(cdr(p1)), $)) {
        // console.lg "p1 inside multiply: " + p1
        // console.lg "first term: " + car(p1)
        return multiply_items(p1.tail().map(function (x) {
            return numerator(x, $);
        }), $);
    }

    if (is_rat(p1)) {
        return mp_numerator(p1);
    }

    if (is_power(p1) && is_negative(caddr(p1))) {
        return one;
    }

    return p1;
}
