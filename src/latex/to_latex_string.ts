import { defs, PRINTMODE_LATEX } from "../runtime/defs";
import { U } from "../tree/tree";
import { LatexPrintEnv } from "./LatexPrintEnv";

export function to_latex_string(expr: U, $: LatexPrintEnv): string {
    const codeGen = defs.codeGen;
    const printMode = defs.printMode;

    defs.codeGen = false;
    defs.setPrintMode(PRINTMODE_LATEX);
    try {
        let str = delegate(expr, $);
        // some variables might contain underscores, escape those
        str = str.replace(/_/g, '\\_');
        return str;
    }
    finally {
        defs.codeGen = codeGen;
        defs.setPrintMode(printMode);
    }
}

/**
 * 
 */
function delegate(expr: U, $: LatexPrintEnv): string {
    const op = $.operatorFor(expr);
    return op.toInfixString(expr);
}
