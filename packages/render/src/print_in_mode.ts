import { Cons, is_cons, U } from "@stemcmicro/tree";
import { Directive } from "./Directive";
import { PrintConfig, render_using_non_sexpr_print_mode } from "./print";
import { PrintMode } from "./PrintMode";
import { render_as_ascii } from "./render_as_ascii";
import { render_as_sexpr } from "./render_as_sexpr";

export function print_in_mode(argList: Cons, printMode: PrintMode, $: PrintConfig): string[] {
    const texts: string[] = [];

    let subList: U = argList;
    while (is_cons(subList)) {
        const value = $.valueOf(subList.car);

        $.pushDirective(Directive.printMode, printMode);
        try {
            if (printMode === PrintMode.Infix) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
            } else if (printMode === PrintMode.Human) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
            } else if (printMode === PrintMode.Ascii) {
                const str = render_as_ascii(value, $);
                texts.push(str);
            } else if (printMode === PrintMode.LaTeX) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
            } else if (printMode === PrintMode.SExpr) {
                const str = render_as_sexpr(value, $);
                texts.push(str);
            }
        } finally {
            $.popDirective();
        }

        subList = subList.argList;
    }

    return texts;
}
