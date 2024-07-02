import { ExprContext } from "@stemcmicro/context";
import { cons_arg } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function arg(x: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = cons_arg(x);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
