import { ExprContext } from "math-expression-context";

export type GUARD<I, O extends I> = (arg: I, $: ExprContext) => arg is O;
