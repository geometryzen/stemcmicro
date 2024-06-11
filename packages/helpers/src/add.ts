import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const ADD = native_sym(Native.add);

export function add(env: Pick<ExprContext, "valueOf">, ...args: U[]): U {
    const raw = items_to_cons(ADD, ...args);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
