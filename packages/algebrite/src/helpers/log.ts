import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const LOG = native_sym(Native.log);

export function log(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(LOG, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
