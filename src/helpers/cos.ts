import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const COS = native_sym(Native.cos);

export function cos(arg: U, env: Pick<ExprContext, 'valueOf'>): U {
    const raw = items_to_cons(COS, arg);
    try {
        return env.valueOf(raw);
    }
    finally {
        raw.release();
    }
}
