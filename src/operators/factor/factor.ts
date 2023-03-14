import { ExtensionEnv } from '../../env/ExtensionEnv';
import { multiply_items_factoring } from '../../multiply';
import { factor_rat } from '../../pollard';
import { MAXPRIMETAB, primetab } from '../../runtime/constants';
import { halt } from '../../runtime/defs';
import { is_multiply } from '../../runtime/helpers';
import { create_int, one, Rat } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';

export function factor_again(p1: U, p2: U, $: ExtensionEnv): U {
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

export function factor(poly: U, x: U, $: ExtensionEnv): U {
    if (is_rat(poly) && poly.isInteger()) {
        return factor_rat(poly); // see pollard.cpp
    }

    return $.factorize(poly, x);
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
            arr.push(create_int(d));
            arr.push(create_int(expo));
        }
    }

    if (n > 1) {
        arr.push(create_int(n));
        arr.push(one);
    }
    return arr;
}
