import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const MULTIPLY = native_sym(Native.multiply);

/**
 * Delegates multiplication of values.
 */
export function multiply(env: Pick<ExprContext, "valueOf">, ...values: U[]): U {
    const raw = items_to_cons(MULTIPLY, ...values);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
