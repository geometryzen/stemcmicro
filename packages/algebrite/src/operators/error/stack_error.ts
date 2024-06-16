import { Err } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { value_of } from "@stemcmicro/eigenmath";
import { ProgramStack } from "@stemcmicro/stack";
import { Cons } from "@stemcmicro/tree";

/**
 * [...] => [..., (head, rest)]
 * @param expr
 * @param env
 * @param $
 */
export function stack_error(expr: Cons, env: ExprContext, $: ProgramStack): void {
    $.push(expr); //  [..., (opr, argList)]
    $.rest(); //  [..., argList]
    $.head(); //  [..., arg]
    value_of(env, $); //  [..., value-of(arg)]
    error(env, $); //  [..., Err(value-of(arg))]
}

/**
 * [..., message] => [..., Err(message)]
 */
export function error(env: ExprContext, $: ProgramStack): void {
    const message = $.pop();
    try {
        const err = new Err(message);
        try {
            $.push(err);
        } finally {
            err.release();
        }
    } finally {
        message.release();
    }
}
