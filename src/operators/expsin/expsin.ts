import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { cadr } from '../../tree/helpers';
import { half } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';

// Do the exponential sine function.
export function Eval_expsin(p1: U, $: ExtensionEnv): U {
    return expsin($.valueOf(cadr(p1)), $);
}

/**
 * sin(z) = 1/2*i*exp(-i*z)-1/2*i*exp(i*z)
 */
export function expsin(z: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.convertTrigToExp, true);
    try {
        const pos_iz = $.multiply(imu, z);
        const neg_iz = $.negate(pos_iz);
        return $.subtract($.multiply(half, imu, $.exp(neg_iz)), $.multiply(half, imu, $.exp(pos_iz)));
    }
    finally {
        $.popDirective();
    }
}
