import { ExtensionEnv } from './env/ExtensionEnv';
import { guess } from './guess';
import { is_rat_integer } from './is_rat_integer';
import { multiply_items_factoring } from './multiply';
import { factor_number } from './pollard';
import { MAXPRIMETAB, primetab } from './runtime/constants';
import { halt } from './runtime/defs';
import { is_multiply } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { caddr, cadr, cdddr } from './tree/helpers';
import { integer, one, Rat } from './tree/rat/Rat';
import { is_cons, NIL, U } from './tree/tree';

// factor a polynomial or integer
export function Eval_factor(p1: U, $: ExtensionEnv): void {
    const top = $.valueOf(cadr(p1));
    const p2 = $.valueOf(caddr(p1));
    const variable = NIL === p2 ? guess(top) : p2;
    let temp = factor(top, variable, $);

    // more factoring?
    p1 = cdddr(p1);
    if (is_cons(p1)) {
        temp = [...p1].reduce((acc: U, p: U) => factor_again(acc, $.valueOf(p), $), temp);
    }
    stack_push(temp);
}

function factor_again(p1: U, p2: U, $: ExtensionEnv): U {
    if (is_multiply(p1)) {
        const arr: U[] = [];
        p1.tail().forEach((el) => factor_term(arr, el, p2, $));
        return multiply_items_factoring(arr, $);
    }

    const arr: U[] = [];
    factor_term(arr, p1, p2, $);
    return arr[0];
}

function factor_term(arr: U[], arg1: U, arg2: U, $: ExtensionEnv): void {
    const p1 = $.factorize(arg1, arg2);
    if (is_multiply(p1)) {
        arr.push(...p1.tail());
        return;
    }

    arr.push(p1);
}

export function factor(p1: U, p2: U, $: ExtensionEnv): U {
    if (is_rat_integer(p1)) {
        return factor_number(p1); // see pollard.cpp
    }

    return $.factorize(p1, p2);
}

// for factoring small integers (2^32 or less)
export function factor_small_number(n: number): Rat[] {
    if (isNaN(n)) {
        halt('number too big to factor');
    }
    const arr: Rat[] = [];
    if (n < 0) {
        n = -n;
    }

    for (let i = 0; i < MAXPRIMETAB; i++) {
        const d = primetab[i];

        if (d > n / d) {
            break;
        }

        let expo = 0;

        while (n % d === 0) {
            n /= d;
            expo++;
        }

        if (expo) {
            arr.push(integer(d));
            arr.push(integer(expo));
        }
    }

    if (n > 1) {
        arr.push(integer(n));
        arr.push(one);
    }
    return arr;
}
