import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const CLOCK = native_sym(Native.clock);

export function clock(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(CLOCK, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
