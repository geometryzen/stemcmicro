import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const INNER = native_sym(Native.inner);

export function inner(lhs: U, rhs: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(INNER, lhs, rhs);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
