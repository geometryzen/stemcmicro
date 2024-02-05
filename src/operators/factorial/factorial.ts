import { create_int, one, zero } from 'math-expression-atoms';
import { is_cons, is_nil, items_to_cons, nil, U } from 'math-expression-tree';
import { bignum_factorial } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { nativeInt } from '../../nativeInt';
import { FACTORIAL } from '../../runtime/constants';
import { defs, move_top_of_stack, noexpand_unary } from '../../runtime/defs';
import { is_add, is_factorial, is_multiply, is_power } from '../../runtime/helpers';
import { stack_pop, stack_push } from '../../runtime/stack';
import { doexpand_value_of } from '../../scripting/doexpand_eval';
import { caddr, cadr } from '../../tree/helpers';

export function factorial(p1: U): U {
    const n = nativeInt(p1);
    if (n < 0 || isNaN(n)) {
        return items_to_cons(FACTORIAL, p1);
    }
    return bignum_factorial(n);
}

// simplification rules for factorials (m < n)
//
//  (e + 1) * factorial(e)  ->  factorial(e + 1)
//
//  factorial(e) / e  ->  factorial(e - 1)
//
//  e / factorial(e)  ->  1 / factorial(e - 1)
//
//  factorial(e + n)
//  ----------------  ->  (e + m + 1)(e + m + 2)...(e + n)
//  factorial(e + m)
//
//  factorial(e + m)                               1
//  ----------------  ->  --------------------------------
//  factorial(e + n)    (e + m + 1)(e + m + 2)...(e + n)

// this function is not actually used, but
// all these simplifications
// do happen automatically via simplify
function simplifyfactorials(p1: U, $: ExtensionEnv): U {
    return noexpand_unary(simplifyfactorials_, p1, $);
}

function simplifyfactorials_(p1: U, $: ExtensionEnv): U {
    if (is_add(p1)) {
        return p1.tail().map(function (x) {
            return simplifyfactorials(x, $);
        }).reduce(function (x, y) {
            return $.add(x, y);
        }, zero);
    }

    if (is_multiply(p1)) {
        return sfac_product(p1, $);
    }

    return p1;
}

function sfac_product(p1: U, $: ExtensionEnv): U {
    const s = defs.tos;

    let n = 0;
    if (is_cons(p1)) {
        p1.tail().forEach((p) => {
            stack_push(p);
            n++;
        });
    }

    for (let i = 0; i < n - 1; i++) {
        if (is_nil(defs.stack[s + i]!)) {
            continue;
        }
        for (let j = i + 1; j < n; j++) {
            if (is_nil(defs.stack[s + j]!)) {
                continue;
            }
            sfac_product_f(s, i, j, $);
        }
    }

    stack_push(one);

    for (let i = 0; i < n; i++) {
        if (is_nil(defs.stack[s + i]!)) {
            continue;
        }
        const arg1 = stack_pop();
        stack_push($.multiply(arg1, defs.stack[s + i] as U));
    }

    p1 = stack_pop();

    move_top_of_stack(defs.tos - n);

    return p1;
}

function sfac_product_f(s: number, a: number, b: number, $: ExtensionEnv) {
    let p3: U, p4: U;

    let p1 = defs.stack[s + a] as U;
    let p2 = defs.stack[s + b] as U;

    if (is_power(p1)) {
        p3 = caddr(p1);
        p1 = cadr(p1);
    }
    else {
        p3 = one;
    }

    if (is_power(p2)) {
        p4 = caddr(p2);
        p2 = cadr(p2);
    }
    else {
        p4 = one;
    }

    if (is_factorial(p1) && is_factorial(p2)) {
        let n = nativeInt(doexpand_value_of($.add(p3, p4), $));
        if (n !== 0) {
            return;
        }

        // Find the difference between the two factorial args.
        // For example, the difference between (a + 2)! and a! is 2.
        n = nativeInt(doexpand_value_of($.subtract(cadr(p1), cadr(p2)), $)); // to simplify
        if (n === 0 || isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = -n;
            const temp1 = p1;
            p1 = p2;
            p2 = temp1;

            const temp2 = p3;
            p3 = p4;
            p4 = temp2;
        }

        let temp3: U = one;
        for (let i = 1; i <= n; i++) {
            temp3 = $.multiply(temp3, $.power($.add(cadr(p2), create_int(i)), p3));
        }
        defs.stack[s + a] = temp3;
        defs.stack[s + b] = nil;
    }
}
