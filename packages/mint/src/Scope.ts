import { ExprContext, ExprHandler } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";

export interface Scope extends ExprContext {
    handlerFor<T extends U>(expr: T): ExprHandler<T>;
}
