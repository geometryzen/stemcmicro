import { imu } from './env/imu';
import { ExtensionEnv } from './env/ExtensionEnv';
import { exp } from './exp';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { half } from './tree/rat/Rat';
import { U } from './tree/tree';

// Do the exponential cosine function.
export function Eval_expcos(p1: U, $: ExtensionEnv): void {
    const result = expcos($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function expcos(p1: U, $: ExtensionEnv): U {
    return $.add(
        $.multiply(
            exp($.multiply(imu, p1), $),
            half
        ),
        $.multiply(
            exp($.multiply($.negate(imu), p1), $),
            half
        )
    );
}
