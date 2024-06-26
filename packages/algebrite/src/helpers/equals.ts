import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const EQUALS = native_sym(Native.testeq);

/**
 * WARNING: Be careful using this function. It will construct (testeq lhs rhs), which can lead to strange treks to simplify.
 * In general it shuld be used sparingly.
 */
export function equals(lhs: U, rhs: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(EQUALS, lhs, rhs);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
