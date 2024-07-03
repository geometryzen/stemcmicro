import { Rat } from "@stemcmicro/atoms";
import { ProgramStack } from "@stemcmicro/stack";

/**
 * (lhs: Rat, rhs: Rat)[...] => [..., lhs * rhs]
 */
export function stack_multiply_rationals(lhs: Rat, rhs: Rat, $: Pick<ProgramStack, "push">): void {
    $.push(lhs.mul(rhs));
}
