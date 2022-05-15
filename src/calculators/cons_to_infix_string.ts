import { ExtensionEnv } from "../env/ExtensionEnv";
import { print_expr } from "../print";
import { Cons } from "../tree/tree";

/**
 * A helper function for printing a Cons expression.
 */
export function cons_to_infix_string(expr: Cons, $: ExtensionEnv): string {
    return print_expr(expr, $);
}