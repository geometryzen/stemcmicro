import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { half } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';

/**
 * expcos(x) = (1/2)*(exp(x*i)+exp(-x*i))
 */
export function expcos(x: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.evaluatingTrigAsExp, true);
    try {
        const pos_xi = $.multiply(x, imu);
        const neg_xi = $.negate(pos_xi);
        return $.multiply(half, $.add($.exp(pos_xi), $.exp(neg_xi)));
    }
    finally {
        $.popDirective();
    }
}
