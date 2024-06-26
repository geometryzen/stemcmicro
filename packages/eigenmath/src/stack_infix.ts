import { ExprContext } from "@stemcmicro/context";
import { ProgramStack } from "@stemcmicro/stack";
import { Cons } from "@stemcmicro/tree";
import { push_string, value_of } from "./eigenmath";
import { infix_config_from_options, infix_expr } from "./format_infix";

export function stack_infix(expr: Cons, env: ExprContext, _: ProgramStack): void {
    _.push(expr); //  [..., expr]
    _.rest(); //  [..., expr.rest]
    _.head(); //  [..., expr.rest.head]
    value_of(env, _); //  [..., x]
    const x = _.pop(); //  [...]
    try {
        const outbuf: string[] = [];
        const config = infix_config_from_options({});
        infix_expr(x, env, config, outbuf);
        const s = outbuf.join("");
        push_string(s, _); // [..., infix(x)]
    } finally {
        x.release();
    }
}
