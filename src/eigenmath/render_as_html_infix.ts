import { U } from "math-expression-tree";
import { ColorCode, html_escape_and_colorize } from "./html_escape_and_colorize";
import { InfixConfig, infixform_expr, infixform_write } from "./infixform";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";

export function render_as_html_infix(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig): string {
    const outbuf: string[] = [];
    infixform_expr(x, env, ctrl, config, outbuf);
    infixform_write("\n", config, outbuf);
    return html_escape_and_colorize(outbuf.join(''), ColorCode.BLACK);
}
