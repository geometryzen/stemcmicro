import { ExtensionEnv } from "../env/ExtensionEnv";
import { zzfloat } from "../operators/float/float";
import { U } from "../tree/tree";

export function float_eval_abs_eval(p1: U, $: ExtensionEnv): U {
    return zzfloat($.valueOf($.abs($.valueOf(p1))), $);
}
