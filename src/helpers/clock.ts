import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const CLOCK = native_sym(Native.clock);

export function clock(arg: U, env: Pick<ExprContext, 'valueOf'>): U {
    const raw = items_to_cons(CLOCK, arg);
    try {
        return env.valueOf(raw);
    }
    finally {
        raw.release();
    }
}
