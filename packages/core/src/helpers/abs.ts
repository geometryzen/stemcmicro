import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const ABS = native_sym(Native.abs);

export function abs(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(ABS, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
