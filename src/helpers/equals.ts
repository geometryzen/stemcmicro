
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const EQUALS = native_sym(Native.testeq);

export function equals(lhs: U, rhs: U, env: Pick<ExprContext, 'valueOf'>): U {
    const raw = items_to_cons(EQUALS, lhs, rhs);
    try {
        return env.valueOf(raw);
    }
    finally {
        raw.release();
    }
}
