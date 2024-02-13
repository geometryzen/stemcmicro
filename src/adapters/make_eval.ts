import { ExprContext } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { StackU } from "../env/StackU";
import { StackFunction } from "./StackFunction";

export function make_eval(consFunction: StackFunction): (expr: Cons, env: ExprContext) => U {
    return function (expr: Cons, env: ExprContext): U {
        const $ = new StackU();
        consFunction(expr, env, env, $);
        return $.pop();
    };
}

