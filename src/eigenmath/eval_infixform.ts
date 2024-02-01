import { U } from "math-expression-tree";
import { cadr } from "../tree/helpers";
import { pop, push, push_string, ScriptVars, value_of } from "./eigenmath";
import { infixform_expr, infix_config_from_options } from "./infixform";

export function eval_infixform(p1: U, $: ScriptVars): void {
    push(cadr(p1), $);
    value_of($);
    p1 = pop($);

    const outbuf: string[] = [];
    const config = infix_config_from_options({});
    infixform_expr(p1, config, outbuf);
    const s = outbuf.join('');
    push_string(s, $);
}

