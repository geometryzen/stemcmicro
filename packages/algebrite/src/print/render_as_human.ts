import { Directive } from "@stemcmicro/directive";
import { U } from "@stemcmicro/tree";
import { PrintMode } from "../runtime/defs";
import { PrintConfig, render_using_non_sexpr_print_mode } from "./print";

export function render_as_human(expr: U, $: PrintConfig): string {
    $.pushDirective(Directive.printMode, PrintMode.Human);
    try {
        const str = render_using_non_sexpr_print_mode(expr, $);
        // some variables might contain underscores, escape those. Why?
        return str.replace(/_/g, "\\_");
    } finally {
        $.popDirective();
    }
}
