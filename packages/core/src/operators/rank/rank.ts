import { create_int, is_tensor, zero } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { value_of } from "../../eigenmath/eigenmath";
import { ProgramStack } from "../../eigenmath/ProgramStack";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "../../env/StackU";

function rank($: ProgramStack): void {
    const value = $.pop();
    try {
        if (is_tensor(value)) {
            $.push(create_int(value.rank));
        } else {
            // The rank of everything else is zero.
            $.push(zero);
        }
    } finally {
        value.release();
    }
}

export function eval_rank(expr: Cons, env: ExtensionEnv): U {
    const $ = new StackU(); // ()
    $.push(expr); // (expr)
    $.rest(); // (argList)
    $.head(); // (arg)
    value_of(env, env, $); // (value)
    rank($); // (rank)
    return $.pop(); // ()
}
