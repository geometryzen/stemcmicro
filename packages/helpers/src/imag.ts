import { ExprContext } from "@stemcmicro/context";
import { cons_imag } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function imag(x: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = cons_imag(x);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
