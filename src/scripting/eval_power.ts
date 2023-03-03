import { ExtensionEnv } from '../env/ExtensionEnv';
import { power_v1 } from '../operators/pow/power_v1';
import { caddr, cadr } from '../tree/helpers';
import { Cons, U } from '../tree/tree';

export function Eval_power(expr: Cons, $: ExtensionEnv): U {
    const base = $.valueOf(cadr(expr));
    const expo = $.valueOf(caddr(expr));
    return power_v1(base, expo, expr, $);
}
