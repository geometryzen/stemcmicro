import { condense } from './condense';
import { ExtensionEnv, PHASE_FACTORING_FLAG } from './env/ExtensionEnv';
import { gcd } from './gcd';
import { is_negative_number } from './is';
import { is_add, is_multiply, is_power } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { caddr, cadr } from './tree/helpers';
import { one, zero } from './tree/rat/Rat';
import { is_tensor } from './tree/tensor/is_tensor';
import { is_cons, U } from './tree/tree';

export function Eval_rationalize(expr: U, $: ExtensionEnv): void {
    const result = rationalize_factoring($.valueOf(cadr(expr)), $);
    stack_push(result);
}

export function rationalize_factoring(argList: U, $: ExtensionEnv): U {
    const phase = $.getPhase();
    // This is a slight departure from the 1.x code, which makes no sense.
    $.setPhase(PHASE_FACTORING_FLAG);
    try {
        const result = yyrationalize(argList, $);
        return result;
    }
    finally {
        $.setPhase(phase);
    }
}

function yyrationalize(arg: U, $: ExtensionEnv): U {
    if (is_tensor(arg)) {
        return __rationalize_tensor(arg, $);
    }

    // This is a slight departure from the 1.x code, which makes no sense.
    // defs.expanding = false;

    if (!is_add(arg)) {
        return arg;
    }

    // get common denominator
    const commonDenominator = multiply_denominators(arg, $);

    // multiply each term by common denominator
    let temp: U = zero;
    if (is_cons(arg)) {
        temp = arg
            .tail()
            .reduce(
                (acc: U, term: U) => $.add(acc, $.multiply(commonDenominator, term)),
                temp
            );
    }
    // collect common factors
    // divide by common denominator
    return $.divide(condense(temp, $), commonDenominator);
}

function multiply_denominators(p: U, $: ExtensionEnv): U {
    if (is_add(p)) {
        return p
            .tail()
            .reduce(
                (acc: U, el: U) => multiply_denominators_term(el, acc, $),
                one
            );
    }
    return multiply_denominators_term(p, one, $);
}

function multiply_denominators_term(p: U, p2: U, $: ExtensionEnv): U {
    if (is_multiply(p)) {
        return p
            .tail()
            .reduce((acc, el) => multiply_denominators_factor(el, acc, $), p2);
    }

    return multiply_denominators_factor(p, p2, $);
}

function multiply_denominators_factor(p: U, p2: U, $: ExtensionEnv): U {
    if (!is_power(p)) {
        return p2;
    }

    const arg2 = p;

    p = caddr(p);

    // like x^(-2) ?
    if (is_negative_number(p)) {
        return __lcm(p2, $.inverse(arg2), $);
    }

    // like x^(-a) ?
    if (is_multiply(p) && is_negative_number(cadr(p))) {
        return __lcm(p2, $.inverse(arg2), $);
    }

    // no match
    return p2;
}

function __rationalize_tensor(p1: U, $: ExtensionEnv): U {

    if (!is_tensor(p1)) {
        // might be zero
        return p1;
    }

    const elems = p1.mapElements(function (x) {
        return rationalize_factoring(x, $);
    });

    return p1.withElements(elems);
}

function __lcm(p1: U, p2: U, $: ExtensionEnv): U {
    return $.divide($.multiply(p1, p2), gcd(p1, p2, $));
}
