import { ExtensionEnv } from "../env/ExtensionEnv";
import { defs, PRINTMODE_HUMAN } from "../runtime/defs";
import { U } from "../tree/tree";
import { render_using_non_sexpr_print_mode } from "./print";

export function render_as_human(expr: U, $: ExtensionEnv): string {
    const codeGen = defs.codeGen;
    const printMode = defs.printMode;

    defs.codeGen = false;
    defs.setPrintMode(PRINTMODE_HUMAN);
    try {
        let str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those
        str = str.replace(/_/g, '\\_');
        return str;
    }
    finally {
        defs.codeGen = codeGen;
        defs.setPrintMode(printMode);
    }
}
