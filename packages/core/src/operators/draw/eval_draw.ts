import { Cons, U } from "@stemcmicro/tree";
import { StackFunction } from "@stemcmicro/eigenmath";
import { make_stack_draw } from "@stemcmicro/eigenmath";
import { ProgramIO } from "@stemcmicro/eigenmath";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "@stemcmicro/eigenmath";

export function eval_draw(expr: Cons, env: ExtensionEnv): U {
    const io: Pick<ProgramIO, "listeners"> = env;
    const consFunction: StackFunction = make_stack_draw(io);
    const stack = new StackU();
    consFunction(expr, env, env, stack);
    return stack.pop();
}
