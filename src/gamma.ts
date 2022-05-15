import { ExtensionEnv } from './env/ExtensionEnv';
import { is_negative_term } from './is';
import { makeList } from './makeList';
import { GAMMA, MEQUAL } from './runtime/constants';
import { DynamicConstants } from './runtime/defs';
import { is_add } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { sine } from './sin';
import { cadr } from './tree/helpers';
import { is_rat } from './tree/rat/is_rat';
import { half, negOne, Rat } from './tree/rat/Rat';
import { car, cdr, U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  Gamma function gamma(x)
//
//-----------------------------------------------------------------------------
export function Eval_gamma(p1: U, $: ExtensionEnv): void {
    const result = gamma($.valueOf(cadr(p1)), $);
    stack_push(result);
}

function gamma(p1: U, $: ExtensionEnv): U {
    return gammaf(p1, $);
}

function gammaf(p1: U, $: ExtensionEnv): U {
    if (is_rat(p1) && MEQUAL(p1.a, 1) && MEQUAL(p1.b, 2)) {
        return $.power(DynamicConstants.Pi(), half);
    }

    if (is_rat(p1) && MEQUAL(p1.a, 3) && MEQUAL(p1.b, 2)) {
        return $.multiply($.power(DynamicConstants.Pi(), half), half);
    }

    //  if (p1->k == DOUBLE) {
    //    d = exp(lgamma(p1.d))
    //    push_double(d)
    //    return
    //  }

    if (is_negative_term(p1)) {
        return $.divide(
            $.multiply(DynamicConstants.Pi(), negOne),
            $.multiply(
                $.multiply(sine($.multiply(DynamicConstants.Pi(), p1), $), p1),
                gamma($.negate(p1), $)
            )
        );
    }

    if (is_add(p1)) {
        return gamma_of_sum(p1, $);
    }

    return makeList(GAMMA, p1);
}

function gamma_of_sum(p1: U, $: ExtensionEnv): U {
    const p3 = cdr(p1);
    if (is_rat(car(p3)) && MEQUAL((car(p3) as Rat).a, 1) && MEQUAL((car(p3) as Rat).b, 1)) {
        return $.multiply(cadr(p3), gamma(cadr(p3), $));
    }

    if (is_rat(car(p3)) && MEQUAL((car(p3) as Rat).a, -1) && MEQUAL((car(p3) as Rat).b, 1)) {
        return $.divide(gamma(cadr(p3), $), $.add(cadr(p3), negOne));
    }

    return makeList(GAMMA, p1);
}
