import { ExprContext } from "math-expression-context";
import { nativeInt } from "../nativeInt";
import { U } from "../tree/tree";

/**
 * Evaluates the expression then converts it to a EcmaScript number.
 */
export function evaluate_integer(expr: U, $: Pick<ExprContext, "valueOf">): number {
    return nativeInt($.valueOf(expr));
}
