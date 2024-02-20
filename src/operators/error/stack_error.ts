import { Err } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { pop, value_of } from "../../eigenmath/eigenmath";
import { ProgramControl } from "../../eigenmath/ProgramControl";
import { ProgramEnv } from "../../eigenmath/ProgramEnv";
import { ProgramStack } from "../../eigenmath/ProgramStack";

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
        $.push(new Err(cause));
    }
    finally {
        cause.release();
    }
}
