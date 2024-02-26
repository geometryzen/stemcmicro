import { Cons, is_cons, U } from "math-expression-tree";
import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { PrintMode } from "../runtime/defs";
import { get_last_print_mode_symbol, render_using_non_sexpr_print_mode } from "./print";
import { render_as_ascii } from "./render_as_ascii";
import { render_as_sexpr } from "./render_as_sexpr";
import { store_text_in_binding } from "./store_text_in_binding";

export function print_in_mode(argList: Cons, printMode: PrintMode, $: ExtensionEnv): string[] {
    const texts: string[] = [];

    let subList: U = argList;
    while (is_cons(subList)) {
        const value = $.valueOf(subList.car);

        $.pushDirective(Directive.printMode, printMode);
        try {
            if (printMode === PrintMode.Infix) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PrintMode.Human) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PrintMode.Ascii) {
                const str = render_as_ascii(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PrintMode.LaTeX) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PrintMode.SExpr) {
                const str = render_as_sexpr(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
        }
        finally {
            $.popDirective();
        }

        subList = subList.argList;
    }

    return texts;
}
