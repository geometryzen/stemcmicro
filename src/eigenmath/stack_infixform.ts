import { U } from "math-expression-tree";
import { cadr } from "../tree/helpers";
import { push_string, value_of } from "./eigenmath";
import { infixform_expr, infix_config_from_options } from "./infixform";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramStack } from "./ProgramStack";

export function stack_infixform(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(cadr(p1));
    value_of(env, ctrl, $);
    p1 = $.pop();

    const outbuf: string[] = [];
    const config = infix_config_from_options({});
    infixform_expr(p1, config, outbuf);
    const s = outbuf.join('');
    push_string(s, $);
}

