import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const POWER = native_sym(Native.pow);

export function power(env: Pick<ExprContext, "valueOf">, base: U, expo: U): U {
    const raw = items_to_cons(POWER, base, expo);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
