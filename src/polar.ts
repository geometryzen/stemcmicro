import { abs } from './operators/abs/abs';
import { imu } from './env/imu';
import { ExtensionEnv } from './env/ExtensionEnv';
import { exp } from './exp';
import { evalPolar } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { U } from './tree/tree';

/*
Convert complex z to polar form

  Input:    p1  z
  Output:    Result

  polar(z) = abs(z) * exp(i * arg(z))
*/
export function Eval_polar(p1: U, $: ExtensionEnv): void {
    const result = polar($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function polar(p1: U, $: ExtensionEnv): U {
    // there are points where we turn polar
    // representations into rect, we set a "stack flag"
    // here to avoid that, so we don't undo the
    // work that we are trying to do.
    return evalPolar(() => {
        return $.multiply(
            abs(p1, $),
            exp($.multiply(imu, $.arg(p1)), $)
        );
    });
}
