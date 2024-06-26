import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const REAL = native_sym(Native.real);

export function real(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(REAL, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
