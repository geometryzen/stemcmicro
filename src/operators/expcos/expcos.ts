import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { exp } from '../../exp';
import { cadr } from '../../tree/helpers';
import { half } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';

// Do the exponential cosine function.
export function Eval_expcos(p1: U, $: ExtensionEnv): U {
    return expcos($.valueOf(cadr(p1)), $);
}

/**
 * cos(x) => (1/2) exp(i*x) + (1/2) exp(-i*x)
 */
export function expcos(x: U, $: ExtensionEnv): U {
    return $.add(
        $.multiply(
            exp($.multiply(imu, x), $),
            half
        ),
        $.multiply(
            exp($.multiply($.negate(imu), x), $),
            half
        )
    );
}
