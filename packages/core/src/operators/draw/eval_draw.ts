import { make_stack_draw } from "@stemcmicro/eigenmath";
import { ProgramIO, StackFunction, StackU } from "@stemcmicro/stack";
import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

export function eval_draw(expr: Cons, env: ExtensionEnv): U {
    const io: Pick<ProgramIO, "listeners"> = env;
    const consFunction: StackFunction = make_stack_draw(io);
    const stack = new StackU();
    consFunction(expr, env, env, stack);
    return stack.pop();
}
