import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Pattern } from "../../patterns/Pattern";
import { U } from "../../tree/tree";
import { is_sym } from "./is_sym";

export class IsSymPattern implements Pattern {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match(expr: U, $: ExtensionEnv): boolean {
        return is_sym(expr);
    }
}