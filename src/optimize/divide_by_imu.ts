import { ExtensionEnv } from "../env/ExtensionEnv";
import { MATH_MUL } from "../runtime/ns_math";
import { imu } from "../tree/imu/ImaginaryUnit";
import { negOne } from "../tree/rat/Rat";
import { items_to_cons, U } from "../tree/tree";

export function divide_by_imu(expr: U, $: ExtensionEnv): U {
    // TODO: This could be optimized by detecting simple inputs.
    const A = expr;
    const B = $.valueOf(items_to_cons(MATH_MUL, A, imu));
    const C = $.valueOf(items_to_cons(MATH_MUL, B, negOne));
    return C;
}