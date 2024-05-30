import { imu, negOne } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { items_to_cons, U } from "math-expression-tree";
import { MATH_MUL } from "../runtime/ns_math";

export function divide_by_imu(expr: U, $: ExprContext): U {
    // TODO: This could be optimized by detecting simple inputs.
    const A = expr;
    const B = $.valueOf(items_to_cons(MATH_MUL, A, imu));
    const C = $.valueOf(items_to_cons(MATH_MUL, B, negOne));
    return C;
}
