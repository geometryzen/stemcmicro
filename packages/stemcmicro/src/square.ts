import { ExtensionEnv } from "./env/ExtensionEnv";
import { two } from "./tree/rat/Rat";
import { U } from "./tree/tree";

export function square(p1: U, $: ExtensionEnv): U {
    return $.power(p1, two);
}
