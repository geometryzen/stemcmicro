import { ExprContext } from "@stemcmicro/context";
import { kronecker, StackU } from "@stemcmicro/eigenmath";
import { Cons, is_cons, U } from "@stemcmicro/tree";

/**
 * (kronecker a b ...)
 */
export function eval_kronecker(expr: Cons, env: ExprContext): U {
    const stack = new StackU();
    const argList = expr.argList;
    try {
        const a = argList.head;
        stack.push(env.valueOf(a));
        let bs = argList.rest;
        while (is_cons(bs)) {
            const b = bs.head;
            stack.push(env.valueOf(b));
            kronecker(env, env, stack);
            bs = bs.rest;
        }
    } finally {
        argList.release();
    }
    return stack.pop();
}
