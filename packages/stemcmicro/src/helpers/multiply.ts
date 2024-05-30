import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const MULTIPLY = native_sym(Native.multiply);

/**
 * Delegates multiplication of values.
 */
export function multiply(env: Pick<ExprContext, "valueOf">, ...values: U[]): U {
    const raw = items_to_cons(MULTIPLY, ...values);
    // console.lg("multiply", `${raw}`);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
