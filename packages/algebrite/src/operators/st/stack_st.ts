import { is_hyp, zero } from "@stemcmicro/atoms";
import { value_of } from "@stemcmicro/eigenmath";
import { ProgramControl, ProgramEnv, ProgramStack } from "@stemcmicro/stack";
import { Cons, is_atom } from "@stemcmicro/tree";
import { ProgrammingError } from "../../programming/ProgrammingError";

export function stack_st(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); //  [expr]
    $.rest(); //  [argList]
    $.head(); //  [argList.head]
    value_of(env, ctrl, $); //  [x]
    st(env, ctrl, $); //  [st(x)]
}

export function st(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const x = $.pop();
    try {
        if (is_atom(x)) {
            if (is_hyp(x)) {
                $.push(zero);
                return;
            }
            throw new ProgrammingError(`st(${x})`);
        }
        $.push(x);
    } finally {
        x.release();
    }
}
