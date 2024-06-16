import { ExprContext } from "@stemcmicro/context";
import { kronecker } from "@stemcmicro/eigenmath";
import { StackU } from "@stemcmicro/stack";
import { Cons, is_cons, U } from "@stemcmicro/tree";

/**
 * (kronecker a b ...)
 */
export function eval_kronecker(expr: Cons, env: ExprContext): U {
    const _ = new StackU();
    const argList = expr.argList;
    try {
        const a = argList.head;
        _.push(env.valueOf(a));
        let bs = argList.rest;
        while (is_cons(bs)) {
            const b = bs.head;
            _.push(env.valueOf(b));
            kronecker(env, _);
            bs = bs.rest;
        }
    } finally {
        argList.release();
    }
    return _.pop();
}
