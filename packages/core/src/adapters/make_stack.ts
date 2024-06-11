import { ExprContextFromProgram, ProgramControl, ProgramEnv, StackFunction } from "@stemcmicro/eigenmath";
import { Cons, U } from "@stemcmicro/tree";
import { EvalFunction } from "../env/ExtensionEnv";
import { ExtensionEnvFromExprContext } from "./ExtensionEnvFromExprContext";

export function make_stack(evalFunction: EvalFunction): StackFunction {
    return function (expr: Cons, env: ProgramEnv, ctrl: ProgramControl): U {
        const adapter = new ExtensionEnvFromExprContext(new ExprContextFromProgram(env, ctrl));
        return evalFunction(expr, adapter);
    };
}
