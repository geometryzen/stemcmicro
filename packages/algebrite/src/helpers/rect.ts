import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const RECT = native_sym(Native.rect);

export function rect(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(RECT, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
