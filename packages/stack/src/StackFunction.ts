import { ExprContext } from "@stemcmicro/context";
import { Cons } from "@stemcmicro/tree";
import { ProgramStack } from "./ProgramStack";

export interface StackFunction {
    (expr: Cons, env: ExprContext, $: ProgramStack): void;
}
