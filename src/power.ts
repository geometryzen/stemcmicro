import { divide } from './helpers/divide';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { exp } from './exp';
import { is_quarter_turn } from './is_quarter_turn';
import { length_of_cons_otherwise_zero } from './length_of_cons_or_zero';
import { factorial } from './operators/factorial/factorial';
import { is_add } from './runtime/helpers';
import { negOne, one, create_int, zero } from './tree/rat/Rat';
import { car, cdr, Cons, is_cons, U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Compute the power of a sum
//
//  Input:    p1  sum
//
//      n  exponent
//
//  Output:    Result on stack
//
//  Note:
//
//  Uses the multinomial series (see Math World)
//
//                          n              n!          n1   n2       nk
//  (a1 + a2 + ... + ak)  = sum (--------------- a1   a2   ... ak  )
//                               n1! n2! ... nk!
//
//  The sum is over all n1 ... nk such that n1 + n2 + ... + nk = n.
//
//-----------------------------------------------------------------------------

// first index is the term number 0..k-1, second index is the exponent 0..n
//define A(i, j) frame[(i) * (n + 1) + (j)]
/**
 * Computes the power of a sum. This is only valid if the terms of the sum commute.
 * @param n 
 * @param sum 
 * @param $ 
 * @returns 
 */
export function power_sum(n: number, sum: Cons, $: ExtensionEnv): U {
    // console.lg(`power_sum(n=${n}, sum=${render_as_infix(sum, $)})`);
    // number of terms in the sum
    // Notice the decrement by 1; we are not going to include the operator.
    const k = length_of_cons_otherwise_zero(sum) - 1;

    // array of powers
    const powers: U[] = [];

    // TODO: sum.argList would be better.
    let p1 = cdr(sum);
    for (let i = 0; i < k; i++) {
        for (let j = 0; j <= n; j++) {
            powers[i * (n + 1) + j] = $.power(car(p1), create_int(j));
        }
        p1 = cdr(p1);
    }

    const a: number[] = [];
    for (let i = 0; i < k; i++) {
        a[i] = 0;
    }

    return multinomial_sum(k, n, a, 0, n, powers, factorial(create_int(n)), zero, $);
}

//-----------------------------------------------------------------------------
//
//  Compute multinomial sum
//
//  Input:    k  number of factors
//
//      n  overall exponent
//
//      a  partition array
//
//      i  partition array index
//
//      m  partition remainder
//
//      p1  n!
//
//      A  factor array
//
//  Output:    Result on stack
//
//  Note:
//
//  Uses recursive descent to fill the partition array.
//
//-----------------------------------------------------------------------------
function multinomial_sum(k: number, n: number, a: number[], i: number, m: number, A: U[], p1: U, p2: U, $: ExtensionEnv): U {
    if (i < k - 1) {
        for (let j = 0; j <= m; j++) {
            a[i] = j;
            p2 = multinomial_sum(k, n, a, i + 1, m - j, A, p1, p2, $);
        }
        return p2;
    }

    a[i] = m;

    // coefficient
    let temp = p1;
    for (let j = 0; j < k; j++) {
        temp = divide(temp, factorial(create_int(a[j])), $);
    }

    // factors
    for (let j = 0; j < k; j++) {
        temp = $.multiply(temp, A[j * (n + 1) + a[j]]);
    }

    return $.add(p2, temp);
}

// exp(n/2 i pi) ?
// clobbers p3
export function simplify_polar(exponent: U, $: ExtensionEnv): U | undefined {
    let n = is_quarter_turn(exponent, $);
    switch (n) {
        case 0:
            // do nothing
            break;
        case 1:
            return one;
        case 2:
            return negOne;
        case 3:
            return imu;
        case 4:
            return $.negate(imu);
    }

    if (is_add(exponent)) {
        let p3 = cdr(exponent);
        while (is_cons(p3)) {
            n = is_quarter_turn(car(p3), $);
            if (n) {
                break;
            }
            p3 = cdr(p3);
        }
        let arg1: U;
        switch (n) {
            case 0:
                return undefined;
            case 1:
                arg1 = one;
                break;
            case 2:
                arg1 = negOne;
                break;
            case 3:
                arg1 = imu;
                break;
            case 4:
                arg1 = $.negate(imu);
                break;
        }
        return $.multiply(arg1, exp($.subtract(exponent, car(p3)), $));
    }

    return undefined;
}

/**
 * Returns the arguments of expr as an array.
 * The operator is not included.
 * (opr a b c ...) => [a, b, c, ...]
 */
export function args_to_items(expr: Cons): U[] {
    // Notice the decrement by 1; we are not going to include the operator.
    const k = length_of_cons_otherwise_zero(expr) - 1;

    const items: U[] = [];

    // TODO: sum.argList would be better.
    let p1 = cdr(expr);
    for (let i = 0; i < k; i++) {
        items.push(car(p1));
        p1 = cdr(p1);
    }
    return items;
}
