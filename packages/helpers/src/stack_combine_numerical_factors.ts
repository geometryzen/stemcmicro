import { Err, is_err, is_num, Num } from "@stemcmicro/atoms";
import { ProgramStack } from "@stemcmicro/stack";
import { stack_multiply_numbers } from "./stack_multiply_numbers";

/**
 *
 * @param start The index to start from in the stack.
 * @param coeff The initial value.
 * @param $
 * @returns
 */
export function stack_combine_numerical_factors(start: number, coeff: Num | Err, $: ProgramStack): Num | Err {
    let end = $.length;

    for (let i = start; i < end; i++) {
        const x = $.getAt(i);

        if (is_num(x)) {
            if (is_num(coeff)) {
                stack_multiply_numbers(coeff, x, $); //     [..., a, b, c, coeff * a], assume i points to a
                coeff = $.pop() as Num; //                  [..., a, b, c]
                $.splice(i, 1); // remove factor        //  [..., b, c]
                i--; //                                     [..., b, c],                i points to element before b
                end--;
            } else {
                $.splice(i, 1); // remove factor
                i--;
                end--;
            }
        } else if (is_err(x)) {
            coeff = x;
            $.splice(i, 1); // remove factor
            i--;
            end--;
        }
    }

    return coeff;
}
