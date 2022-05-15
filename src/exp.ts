
import { ExtensionEnv } from './env/ExtensionEnv';
import { MATH_E } from './runtime/ns_math';
import { U } from "./tree/tree";

export function exp(x: U, $: ExtensionEnv): U {
    return $.power(MATH_E, x);
}
