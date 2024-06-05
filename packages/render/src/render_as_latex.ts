import { Directive } from "@stemcmicro/directive";
import { U } from "@stemcmicro/tree";
import { PrintConfig, render_using_non_sexpr_print_mode } from "./print";
import { PrintMode } from "./PrintMode";

export function render_as_latex(expr: U, $: PrintConfig): string {
    $.pushDirective(Directive.printMode, PrintMode.LaTeX);
    try {
        const str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those
        return str.replace(/_/g, "\\_");
    } finally {
        $.popDirective();
    }
}
