import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { exp } from '../../exp';
import { cadr } from '../../tree/helpers';
import { U } from '../../tree/tree';
import { abs } from '../abs/abs';
import { arg } from '../arg/arg';

/*
Convert complex z to polar form

  Input:    p1  z
  Output:    Result

  polar(z) = abs(z) * exp(i * arg(z))
*/
export function Eval_polar(p1: U, $: ExtensionEnv): U {
    const result = polar($.valueOf(cadr(p1)), $);
    return result;
}

export function polar(p1: U, $: ExtensionEnv): U {
    // there are points where we turn polar
    // representations into rect, we set a "stack flag"
    // here to avoid that, so we don't undo the
    // work that we are trying to do.
    const mode = $.getNativeDirective(Directive.evaluatingAsPolar);
    $.setNativeDirective(Directive.evaluatingAsPolar, true);
    try {
        return $.multiply(abs(p1, $), exp($.multiply(imu, arg(p1, $)), $));
    }
    finally {
        $.setNativeDirective(Directive.evaluatingAsPolar, mode);
    }
}
