import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Pattern } from "../../patterns/Pattern";
import { U } from "../../tree/tree";
import { is_sym } from "./is_sym";

export class VectorPattern implements Pattern {
    match(expr: U, $: ExtensionEnv): boolean {
        return is_sym(expr) && $.treatAsVector(expr);
    }
}