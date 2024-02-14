import { car, cdr, is_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { divide } from '../../helpers/divide';
import { inverse } from '../../helpers/inverse';
import { doexpand_binary } from '../../runtime/defs';
import { gcd } from '../gcd/gcd';

// Find the least common multiple of two expressions.
export function eval_lcm(p1: U, $: ExtensionEnv): U {
    p1 = cdr(p1);
    let result = $.valueOf(car(p1));
    if (is_cons(p1)) {
        result = p1.tail().reduce((a: U, b: U) => lcm(a, $.valueOf(b), $), result);
    }
    return result;
}

export function lcm(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'pushDirective' | 'popDirective'>): U {
    return doexpand_binary(yylcm, p1, p2, $);
}

function yylcm(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'popDirective' | 'pushDirective'>): U {
    const A = gcd(p1, p2, $);
    const B = divide(A, p1, $);
    const C = divide(B, p2, $);
    return inverse(C, $);
}
