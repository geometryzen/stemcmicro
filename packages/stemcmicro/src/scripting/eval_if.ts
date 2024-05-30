import { ExtensionEnv } from "../env/ExtensionEnv";
import { stack_push } from "../runtime/stack";
import { Cons } from "../tree/tree";

/**
 * TODO: Just an idea for conditional return values.
 * @param expr
 * @param $
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function eval_if(expr: Cons, $: ExtensionEnv): void {
    // const args_expr = args(expr, $);
    // console.lg(`args_expr => ${args_expr}`);
    // const result = abs(Eval(cadr(expr), $), $);
    stack_push(expr);
}
