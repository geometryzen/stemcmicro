import { ProgramControl, ProgramEnv } from "@stemcmicro/stack";
import { U } from "@stemcmicro/tree";
import { InfixConfig, infix_expr, infix_write } from "./format_infix";
import { ColorCode, html_escape_and_colorize } from "./html_escape_and_colorize";

export function render_as_html_infix(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig): string {
    const outbuf: string[] = [];
    infix_expr(x, env, ctrl, config, outbuf);
    infix_write("\n", config, outbuf);
    return html_escape_and_colorize(outbuf.join(""), ColorCode.BLACK);
}
