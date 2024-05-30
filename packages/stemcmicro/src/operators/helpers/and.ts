import { ExprContext } from "@stemcmicro/context";
import { GUARD } from "./GUARD";

export function and<I, L extends I, R extends L, O extends R>(guardL: GUARD<I, L>, guardR: GUARD<L, R>): GUARD<I, O> {
    return function (arg: I, $: ExprContext): arg is O {
        return guardL(arg, $) && guardR(arg, $);
    };
}
