import { create_flt, is_rat, Num } from "@stemcmicro/atoms";
import { ProgramStack } from "@stemcmicro/stack";
import { stack_multiply_rationals } from "./stack_multiply_rationals";

/**
 * Multiply two numbers and push the result onto the stack.
 *
 * (lhs: Num, rhs: Num) [...] => [..., lhs * rhs]
 */
export function stack_multiply_numbers(lhs: Num, rhs: Num, $: Pick<ProgramStack, "push">): void {
    if (is_rat(lhs) && is_rat(rhs)) {
        stack_multiply_rationals(lhs, rhs, $);
        return;
    }

    const a = lhs.toNumber();
    const b = rhs.toNumber();

    $.push(create_flt(a * b));
}
