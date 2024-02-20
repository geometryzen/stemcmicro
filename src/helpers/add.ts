import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const ADD = native_sym(Native.add);

export function add(env: Pick<ExprContext, 'valueOf'>, ...args: U[]): U {
    const raw = items_to_cons(ADD, ...args);
    try {
        return env.valueOf(raw);
    }
    finally {
        raw.release();
    }
}
