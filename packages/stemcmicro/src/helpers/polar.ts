import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const POLAR = native_sym(Native.polar);

export function polar(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(POLAR, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
