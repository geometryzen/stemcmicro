import { Cons, U } from "math-expression-tree";
import { ProgramControl } from "../eigenmath/ProgramControl";
import { ProgramEnv } from "../eigenmath/ProgramEnv";
import { ProgramStack } from "../eigenmath/ProgramStack";
import { EvalFunction } from "../env/ExtensionEnv";
import { ExprContextFromProgram } from "./ExprContextFromProgram";
import { ExtensionEnvFromExprContext } from "./ExtensionEnvFromExprContext";
import { StackFunction } from "./StackFunction";

export function make_stack(evalFunction: EvalFunction): StackFunction {
    return function (expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): U {
        const adapter = new ExtensionEnvFromExprContext(new ExprContextFromProgram(env, ctrl, $));
        return evalFunction(expr, adapter);
    };
}


