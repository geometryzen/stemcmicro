import { ExtensionEnv } from "../env/ExtensionEnv";
import { U } from "../tree/tree";
import { Pattern } from "./Pattern";

export class AnyPattern implements Pattern {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match(expr: U, $: ExtensionEnv): boolean {
        return true;
    }
}