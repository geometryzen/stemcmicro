import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const CONJ = native_sym(Native.conj);

export function conj(z: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = items_to_cons(CONJ, z);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
