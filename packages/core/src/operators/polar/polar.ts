import { imu } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

/*
Convert complex z to polar form

  Input:    p1  z
  Output:    Result

  polar(z) = abs(z) * exp(i * arg(z))
*/
export function eval_polar(expr: Cons, $: ExtensionEnv): U {
    const z = $.valueOf(expr.argList.head);
    return polar(z, $);
}

function polar(z: U, $: ExtensionEnv): U {
    // console.lg("polar", $.toInfixString(z));
    $.pushDirective(Directive.complexAsPolar, 1);
    try {
        const r = $.abs(z);
        // console.lg("r =", $.toInfixString(r));
        const theta = $.arg(z);
        // console.lg("theta =", $.toInfixString(theta));
        const imu_times_theta = $.multiply(imu, theta);
        // console.lg("imu_times_theta", $.toInfixString(imu_times_theta));
        const unit = $.exp(imu_times_theta);
        // console.lg("unit", $.toInfixString(unit));
        return $.multiply(r, unit);
    } finally {
        $.popDirective();
    }
}
