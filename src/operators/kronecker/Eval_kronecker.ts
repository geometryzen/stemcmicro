import { Cons, is_cons, U } from "math-expression-tree";
import { kronecker } from "../../eigenmath/eigenmath";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "../../env/StackU";

/**
 * (kronecker a b ...)
 */
export function Eval_kronecker(expr: Cons, env: ExtensionEnv): U {
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
    }
    finally {
        argList.release();
    }
    return stack.pop();
}
