import { U } from "math-expression-tree";
import { defs, PRINTMODE_HUMAN } from "../runtime/defs";
import { PrintConfig, render_using_non_sexpr_print_mode } from "./print";

export function render_as_human(expr: U, $: PrintConfig): string {
    const codeGen = defs.codeGen;
    const printMode = defs.printMode;

    defs.codeGen = false;
    defs.setPrintMode(PRINTMODE_HUMAN);
    try {
        const str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those. Why?
        return str.replace(/_/g, '\\_');
    }
    finally {
        defs.codeGen = codeGen;
        defs.setPrintMode(printMode);
    }
}
