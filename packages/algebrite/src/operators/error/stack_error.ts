import { Err } from "@stemcmicro/atoms";
import { value_of } from "@stemcmicro/eigenmath";
import { ProgramControl, ProgramEnv, ProgramStack } from "@stemcmicro/stack";
import { Cons } from "@stemcmicro/tree";

/**
 * [...] => [..., (head, rest)]
 * @param expr
 * @param env
 * @param ctrl
 * @param $
 */
export function stack_error(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); //  [..., (opr, argList)]
    $.rest(); //  [..., argList]
    $.head(); //  [..., arg]
    value_of(env, ctrl, $); //  [..., value-of(arg)]
    error(env, ctrl, $); //  [..., Err(value-of(arg))]
}

/**
 * [..., message] => [..., Err(message)]
 */
export function error(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
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
