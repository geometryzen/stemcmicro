import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const FLOAT = native_sym(Native.float);

export function float(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(FLOAT, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
