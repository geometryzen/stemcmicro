import { is_hyp, zero } from "math-expression-atoms";
import { Cons, is_atom } from "math-expression-tree";
import { head, push, rest, value_of } from "../../eigenmath/eigenmath";
import { ProgramControl } from "../../eigenmath/ProgramControl";
import { ProgramEnv } from "../../eigenmath/ProgramEnv";
import { ProgramStack } from "../../eigenmath/ProgramStack";
import { ProgrammingError } from "../../programming/ProgrammingError";

export function eval_st(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(expr, $);          //  [expr]
    rest($);                //  [argList]
    head($);                //  [argList.head]
    value_of(env, ctrl, $); //  [x]
    st(env, ctrl, $);       //  [st(x)]    
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
    }
    finally {
        x.release();
    }
}