import { ExprContext } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { StackU } from "../env/StackU";
import { ConsFunction } from "./ConsFunction";

export function make_eval(consFunction: ConsFunction): (expr: Cons, env: ExprContext) => U {
    return function (expr: Cons, env: ExprContext): U {
        const $ = new StackU();
        consFunction(expr, env, env, $);
        return $.pop();
    };
}

