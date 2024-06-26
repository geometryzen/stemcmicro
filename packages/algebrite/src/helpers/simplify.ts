import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const SIMPLIFY = native_sym(Native.simplify);

export function simplify(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(SIMPLIFY, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
