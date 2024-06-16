import { ExprContext } from "@stemcmicro/context";
import { StackFunction } from "@stemcmicro/stack";
import { Cons, U } from "@stemcmicro/tree";
import { EvalFunction } from "../env/ExtensionEnv";
import { ExtensionEnvFromExprContext } from "./ExtensionEnvFromExprContext";

export function make_stack(evalFunction: EvalFunction): StackFunction {
    return function (expr: Cons, env: ExprContext): U {
        const adapter = new ExtensionEnvFromExprContext(env);
        return evalFunction(expr, adapter);
    };
}
