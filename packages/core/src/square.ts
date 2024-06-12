import { two } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";

export function square(p1: U, $: ExtensionEnv): U {
    return $.power(p1, two);
}
