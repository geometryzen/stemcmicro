import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const COS = native_sym(Native.cos);

export function cos(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(COS, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
