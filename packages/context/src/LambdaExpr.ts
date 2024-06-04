import { Cons, U } from "@stemcmicro/tree";
import { ExprContext } from "./ExprContext";

/**
 * Here the first argument is the argument list and does not include the operator.
 */
export type LambdaExpr = (argList: Cons, $: ExprContext) => U;
