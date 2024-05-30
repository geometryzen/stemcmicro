import { Cons } from "math-expression-tree";
import { push_string, value_of } from "./eigenmath";
import { infix_expr, infix_config_from_options } from "./format_infix";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramStack } from "./ProgramStack";

export function stack_infix(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    _.push(expr); //  [..., expr]
    _.rest(); //  [..., expr.rest]
    _.head(); //  [..., expr.rest.head]
    value_of(env, ctrl, _); //  [..., x]
    const x = _.pop(); //  [...]
    try {
        const outbuf: string[] = [];
        const config = infix_config_from_options({});
        infix_expr(x, env, ctrl, config, outbuf);
        const s = outbuf.join("");
        push_string(s, _); // [..., infix(x)]
    } finally {
        x.release();
    }
}
