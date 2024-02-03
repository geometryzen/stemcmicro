import { U } from "math-expression-tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { defs, PRINTMODE_INFIX } from "../runtime/defs";
import { render_using_non_sexpr_print_mode } from "./print";

export function render_as_infix(expr: U, $: ExtensionEnv): string {
    // console.lg(`render_as_infix: ${expr}`);
    const codeGen = defs.codeGen;
    const printMode = defs.printMode;

    defs.codeGen = false;
    defs.setPrintMode(PRINTMODE_INFIX);
    try {
        const str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those
        return str.replace(/_/g, '\\_');
    }
    finally {
        defs.codeGen = codeGen;
        defs.setPrintMode(printMode);
    }
}
