import { U } from "math-expression-tree";
import { Directive } from "../env/ExtensionEnv";
import { PrintMode } from "../runtime/defs";
import { PrintConfig, render_using_non_sexpr_print_mode } from "./print";

export function render_as_infix(expr: U, $: PrintConfig): string {
    $.pushDirective(Directive.printMode, PrintMode.Infix);
    try {
        const str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those
        return str.replace(/_/g, '\\_');
    }
    finally {
        $.popDirective();
    }
}
