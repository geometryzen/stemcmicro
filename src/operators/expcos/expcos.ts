import { U } from 'math-expression-tree';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { half } from '../../tree/rat/Rat';

/**
 * expcos(x) = (1/2)*(exp(x*i)+exp(-x*i))
 */
export function expcos(x: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.convertTrigToExp, 1);
    try {
        const pos_xi = $.multiply(x, imu);
        const neg_xi = $.negate(pos_xi);
        return $.multiply(half, $.add($.exp(pos_xi), $.exp(neg_xi)));
    }
    finally {
        $.popDirective();
    }
}
