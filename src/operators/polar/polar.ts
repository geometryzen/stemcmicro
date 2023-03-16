import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { cadr } from '../../tree/helpers';
import { Cons, U } from '../../tree/tree';

/*
Convert complex z to polar form

  Input:    p1  z
  Output:    Result

  polar(z) = abs(z) * exp(i * arg(z))
*/
export function Eval_polar(expr: Cons, $: ExtensionEnv): U {
    return polar($.valueOf(cadr(expr)), $);
}

export function polar(z: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.evaluatingAsPolar, true);
    try {
        const r = $.abs(z);
        // console.lg("r", $.toInfixString(r));
        const theta = $.arg(z);
        // console.lg("theta", $.toInfixString(theta));
        const imu_times_theta = $.multiply(imu, theta);
        // console.lg("imu_times_theta", $.toInfixString(imu_times_theta));
        const unit = $.exp(imu_times_theta);
        // console.lg("unit", $.toInfixString(unit));
        return $.multiply(r, unit);
    }
    finally {
        $.popDirective();
    }
}