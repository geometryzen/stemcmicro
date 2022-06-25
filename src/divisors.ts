import { sort_factors } from './calculators/compare/sort_factors';
import { ExtensionEnv } from './env/ExtensionEnv';
import { factor_small_number } from './factor';
import { gcd } from './operators/gcd/gcd';
import { nativeInt } from './nativeInt';
import { is_num } from './operators/num/is_num';
import { is_add, is_multiply, is_power } from './runtime/helpers';
import { caddr, cadr } from './tree/helpers';
import { Tensor } from './tree/tensor/Tensor';
import { wrap_as_int, one, zero } from './tree/rat/Rat';
import { car, cdr, is_cons, U } from './tree/tree';

function signum(n: number): 1 | -1 | 0 {
    if (n < 0) {
        return -1;
    }
    else if (n > 0) {
        return 1;
    }
    else {
        return 0;
    }
}


//-----------------------------------------------------------------------------
//
//  Generate all divisors of a term
//
//  Input:    Term (factor * factor * ...)
//
//  Output:    Divisors
//
//-----------------------------------------------------------------------------
export function divisors(term: U, $: ExtensionEnv): U {
    // console.lg(`divisors(p=${JSON.stringify(p)})`);
    const factors = ydivisors(term, $);
    const n = factors.length;
    sort_factors(factors, $);
    return new Tensor([n], factors);
}

export function ydivisors(p1: U, $: ExtensionEnv): U[] {
    const stack: U[] = [];
    // push all of the term's factors
    if (is_num(p1)) {
        stack.push(...factor_small_number(nativeInt(p1)));
    }
    else if (is_cons(p1) && is_add(p1)) {
        stack.push(...__factor_add(p1, $));
    }
    else if (is_multiply(p1)) {
        p1 = cdr(p1);
        if (is_num(car(p1))) {
            stack.push(...factor_small_number(nativeInt(car(p1))));
            p1 = cdr(p1);
        }
        if (is_cons(p1)) {
            const mapped = [...p1].map((p2) => {
                if (is_power(p2)) {
                    return [cadr(p2), caddr(p2)];
                }
                return [p2, one];
            });
            stack.push(...mapped.flat());
        }
    }
    else if (is_power(p1)) {
        stack.push(cadr(p1), caddr(p1));
    }
    else {
        stack.push(p1, one);
    }

    const k = stack.length;

    // contruct divisors by recursive descent
    stack.push(one);
    gen(stack, 0, k, $);

    return stack.slice(k);
}

//-----------------------------------------------------------------------------
//
//  Generate divisors
//
//  Input:    Base-exponent pairs on stack
//
//      h  first pair
//
//      k  just past last pair
//
//  Output:    Divisors on stack
//
//  For example, factor list 2 2 3 1 results in 6 divisors,
//
//    1
//    3
//    2
//    6
//    4
//    12
//
//-----------------------------------------------------------------------------
function gen(stack: U[], h: number, k: number, $: ExtensionEnv): void {
    const ACCUM: U = stack.pop() as U;

    if (h === k) {
        stack.push(ACCUM);
        return;
    }

    const BASE: U = stack[h + 0];
    const EXPO: U = stack[h + 1];

    const expo = nativeInt(EXPO);
    if (!isNaN(expo)) {
        for (let i = 0; i <= Math.abs(expo); i++) {
            stack.push($.multiply(ACCUM, $.power(BASE, wrap_as_int(signum(expo) * i))));
            gen(stack, h + 2, k, $);
        }
    }
}

//-----------------------------------------------------------------------------
//
//  Factor ADD expression
//
//  Input:    Expression
//
//  Output:    Factors
//
//  Each factor consists of two expressions, the factor itself followed
//  by the exponent.
//
//-----------------------------------------------------------------------------
function __factor_add(p1: U, $: ExtensionEnv): U[] {
    // get gcd of all terms
    const temp1 = is_cons(p1) ? p1.tail().reduce(function (x, y) {
        return gcd(x, y, $);
    }) : car(p1);

    const stack: U[] = [];
    // check gcd
    let p2 = temp1;
    if ($.isOne(p2)) {
        stack.push(p1, one);
        return stack;
    }

    // push factored gcd
    if (is_num(p2)) {
        stack.push(...factor_small_number(nativeInt(p2)));
    }
    else if (is_multiply(p2)) {
        const p3 = cdr(p2);
        if (is_num(car(p3))) {
            stack.push(...factor_small_number(nativeInt(car(p3))));
        }
        else {
            stack.push(car(p3), one);
        }
        if (is_cons(p3)) {
            p3.tail().forEach((p) => stack.push(p, one));
        }
    }
    else {
        stack.push(p2, one);
    }

    // divide each term by gcd
    p2 = $.inverse(p2);
    const temp2 = is_cons(p1)
        ? p1.tail().reduce((a: U, b: U) => $.add(a, $.multiply(p2, b)), zero)
        : cdr(p1);

    stack.push(temp2, one);
    return stack;
}
