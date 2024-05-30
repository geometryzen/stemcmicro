import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const ARG = native_sym(Native.arg);

export function arg(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(ARG, arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
