import { U } from "math-expression-tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { defs, PRINTMODE_LATEX } from "../runtime/defs";
import { render_using_non_sexpr_print_mode } from "./print";

export function render_as_latex(expr: U, $: ExtensionEnv): string {
    const codeGen = defs.codeGen;
    const printMode = defs.printMode;

    defs.codeGen = false;
    defs.setPrintMode(PRINTMODE_LATEX);
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
