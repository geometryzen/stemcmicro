import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const FACTORIZE = native_sym(Native.testeq);

export function factorize(lhs: U, rhs: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(FACTORIZE, lhs, rhs);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
