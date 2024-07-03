import { ProgramStack } from "@stemcmicro/stack";
import { nil } from "@stemcmicro/tree";

/**
 * [..., x1, x2, ..., xn] => [..., (x1, x2, ..., xn)]
 */
export function stack_items_to_cons(n: number, $: Pick<ProgramStack, "push" | "cons">): void {
    $.push(nil);
    for (let i = 0; i < n; i++) {
        $.cons();
    }
}
