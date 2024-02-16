import { ExtensionEnv } from "../../env/ExtensionEnv";
import { GUARD } from "./GUARD";

export function and<I, L extends I, R extends L, O extends R>(guardL: GUARD<I, L>, guardR: GUARD<L, R>): GUARD<I, O> {
    return function (arg: I, $: ExtensionEnv): arg is O {
        return guardL(arg, $) && guardR(arg, $);
    };
}
