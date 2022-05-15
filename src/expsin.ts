import { imu } from './env/imu';
import { ExtensionEnv } from './env/ExtensionEnv';
import { exp } from './exp';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { half } from './tree/rat/Rat';
import { U } from './tree/tree';

// Do the exponential sine function.
export function Eval_expsin(p1: U, $: ExtensionEnv): void {
    const result = expsin($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function expsin(p1: U, $: ExtensionEnv): U {
    return $.subtract(
        $.multiply(
            $.divide(exp($.multiply(imu, p1), $), imu),
            half
        ),
        $.multiply($.divide(exp($.multiply($.negate(imu), p1), $), imu), half));
}
