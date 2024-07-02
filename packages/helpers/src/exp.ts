import { ExprContext } from "@stemcmicro/context";
import { cons_exp } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function exp(arg: U, env: Pick<ExprContext, "valueOf">): U {
    const raw = cons_exp(arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
