import { ExtensionEnv } from '../../env/ExtensionEnv';
import { gcd } from '../../gcd';
import { use_expanding_with_binary_function } from '../../runtime/defs';
import { car, cdr, is_cons, U } from '../../tree/tree';

// Find the least common multiple of two expressions.
export function Eval_lcm(p1: U, $: ExtensionEnv): U {
    p1 = cdr(p1);
    let result = $.valueOf(car(p1));
    if (is_cons(p1)) {
        result = p1.tail().reduce((a: U, b: U) => lcm(a, $.valueOf(b), $), result);
    }
    return result;
}

export function lcm(p1: U, p2: U, $: ExtensionEnv): U {
    return use_expanding_with_binary_function(yylcm, p1, p2, $);
}

function yylcm(p1: U, p2: U, $: ExtensionEnv): U {
    const A = gcd(p1, p2, $);
    const B = $.divide(A, p1);
    const C = $.divide(B, p2);
    return $.inverse(C);
}
