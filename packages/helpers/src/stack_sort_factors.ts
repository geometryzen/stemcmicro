import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramStack } from "@stemcmicro/stack";

export function stack_sort_factors(start: number, env: ExprContext, $: ProgramStack): void {
    const compareFn = env.compareFn(native_sym(Native.multiply));
    const parts = $.splice(start);
    const t = parts.sort(compareFn);
    $.concat(t);
}
