import { ExprContext } from "@stemcmicro/context";
import { cons_log } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function log(x: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = cons_log(x);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
