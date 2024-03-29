
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const POWER = native_sym(Native.pow);

export function power(env: Pick<ExprContext, 'valueOf'>, base: U, expo: U,): U {
    const raw = items_to_cons(POWER, base, expo);
    try {
        return env.valueOf(raw);
    }
    finally {
        raw.release();
    }
}
