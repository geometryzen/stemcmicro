import { U } from "math-expression-tree";
import { ColorCode, html_escape_and_colorize } from "./html_escape_and_colorize";
import { InfixConfig, infixform_expr, infixform_write } from "./infixform";

export function render_as_html_infix(p: U, config: InfixConfig): string {
    const outbuf: string[] = [];
    infixform_expr(p, config, outbuf);
    infixform_write("\n", config, outbuf);
    return html_escape_and_colorize(outbuf.join(''), ColorCode.BLACK);
}
