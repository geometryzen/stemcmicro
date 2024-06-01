import { U } from "@stemcmicro/tree";
import { Directive } from "./Directive";
import { PrintConfig, render_using_non_sexpr_print_mode } from "./print";
import { PrintMode } from "./PrintMode";

export function render_as_infix(expr: U, $: PrintConfig): string {
    $.pushDirective(Directive.printMode, PrintMode.Infix);
    try {
        const str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those
        return str.replace(/_/g, "\\_");
    } finally {
        $.popDirective();
    }
}
