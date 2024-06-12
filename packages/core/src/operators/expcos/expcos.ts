import { half } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";

/**
 * expcos(x) = (1/2)*(exp(x*i)+exp(-x*i))
 */
export function expcos(x: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.convertTrigToExp, 1);
    try {
        const pos_xi = $.multiply(x, imu);
        const neg_xi = $.negate(pos_xi);
        return $.multiply(half, $.add($.exp(pos_xi), $.exp(neg_xi)));
    } finally {
        $.popDirective();
    }
}
