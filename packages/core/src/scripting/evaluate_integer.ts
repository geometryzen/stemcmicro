import { ExprContext } from "@stemcmicro/context";
import { num_to_number } from "../nativeInt";
import { U } from "../tree/tree";

/**
 * Evaluates the expression then converts it to a EcmaScript number.
 */
export function evaluate_integer(expr: U, $: Pick<ExprContext, "valueOf">): number {
    return num_to_number($.valueOf(expr));
}
