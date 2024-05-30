import { ProgrammingError } from "../programming/ProgrammingError";
import { PrintMode } from "../runtime/defs";
import { U } from "../tree/tree";
import { PrintConfig } from "./print";
import { render_as_ascii } from "./render_as_ascii";
import { render_as_human } from "./render_as_human";
import { render_as_infix } from "./render_as_infix";
import { render_as_latex } from "./render_as_latex";
import { render_as_sexpr } from "./render_as_sexpr";

export function render_using_print_mode(expr: U, printMode: PrintMode, $: PrintConfig): string {
    switch (printMode) {
        case PrintMode.Ascii:
            return render_as_ascii(expr, $);
        case PrintMode.Human:
            return render_as_human(expr, $);
        case PrintMode.Infix:
            return render_as_infix(expr, $);
        case PrintMode.LaTeX:
            return render_as_latex(expr, $);
        case PrintMode.SExpr:
            return render_as_sexpr(expr, $);
        default:
            throw new ProgrammingError();
    }
}
