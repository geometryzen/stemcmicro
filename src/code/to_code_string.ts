import { ExtensionEnv } from "../env/ExtensionEnv";
import { defs } from "../runtime/defs";
import { U } from "../tree/tree";

export function to_code_string(expr: U, $: ExtensionEnv): string {
    const origCodeGen = defs.codeGen;
    defs.codeGen = true;
    try {
        return $.toInfixString(expr);
    }
    finally {
        defs.codeGen = origCodeGen;
    }
}