import { assert_str } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

const INFIX = native_sym(Native.infix);

export function infix(arg: U, env: Pick<ExprContext, "valueOf">): string {
    const raw = items_to_cons(INFIX, arg);
    try {
        return assert_str(env.valueOf(raw)).str;
    } finally {
        raw.release();
    }
}
