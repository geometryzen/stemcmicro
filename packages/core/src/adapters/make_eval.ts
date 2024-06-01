import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { StackU } from "../env/StackU";
import { StackFunction } from "./StackFunction";

export function make_eval(stackFunction: StackFunction): (expr: Cons, env: ExprContext) => U {
    return function (expr: Cons, env: ExprContext): U {
        const $ = new StackU();
        stackFunction(expr, env, env, $);
        return $.pop();
    };
}
