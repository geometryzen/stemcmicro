
import { ExtensionEnv } from './env/ExtensionEnv';
import { Native } from './native/Native';
import { native_sym } from './native/native_sym';
import { U } from "./tree/tree";

/**
 * exp(x) => (expt e x)
 */
export function exp(x: U, $: ExtensionEnv): U {
    return $.power(native_sym(Native.E), x);
}
