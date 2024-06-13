import { pop, value_of } from "@stemcmicro/eigenmath";
import { ProgramControl, ProgramEnv, ProgramStack } from "@stemcmicro/stack";
import { U } from "@stemcmicro/tree";
import { hook_create_err } from "../../hooks/hook_create_err";

export function stack_error(expr: U, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    _.push(expr);
    _.rest();
    _.head();
    value_of(env, ctrl, _);
    error(env, ctrl, _);
}

export function error(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const cause = pop($);
    try {
        $.push(hook_create_err(cause));
    } finally {
        cause.release();
    }
}
