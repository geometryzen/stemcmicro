import { Cons, U } from "@stemcmicro/tree";
import { StackFunction } from "../../adapters/StackFunction";
import { make_stack_draw } from "../../eigenmath/make_stack_draw";
import { ProgramIO } from "../../eigenmath/ProgramIO";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "../../env/StackU";

export function eval_draw(expr: Cons, env: ExtensionEnv): U {
    const io: Pick<ProgramIO, "listeners"> = env;
    const consFunction: StackFunction = make_stack_draw(io);
    const stack = new StackU();
    consFunction(expr, env, env, stack);
    return stack.pop();
}
