import { ExprContext } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { ProgramControl } from "../eigenmath/ProgramControl";
import { ProgramEnv } from "../eigenmath/ProgramEnv";
import { ProgramStack } from "../eigenmath/ProgramStack";
import { ConsFunction } from "./ConsFunction";
import { ExprContextAdapter } from "./ExprContextAdapter";

export function make_stack(consExpr: (expr: Cons, env: ExprContext) => U): ConsFunction {
    return function (expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): U {
        const adapter = new ExprContextAdapter(env, ctrl, $);
        return consExpr(expr, adapter);
    };
}


