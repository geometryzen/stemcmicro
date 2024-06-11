import { Cons, U } from "@stemcmicro/tree";
import { ProgramControl } from "@stemcmicro/eigenmath";
import { ProgramEnv } from "@stemcmicro/eigenmath";
import { EvalFunction } from "../env/ExtensionEnv";
import { ExprContextFromProgram } from "@stemcmicro/eigenmath";
import { ExtensionEnvFromExprContext } from "./ExtensionEnvFromExprContext";
import { StackFunction } from "@stemcmicro/eigenmath";

export function make_stack(evalFunction: EvalFunction): StackFunction {
    return function (expr: Cons, env: ProgramEnv, ctrl: ProgramControl): U {
        const adapter = new ExtensionEnvFromExprContext(new ExprContextFromProgram(env, ctrl));
        return evalFunction(expr, adapter);
    };
}
