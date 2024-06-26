import { ExprContext } from "@stemcmicro/context";
import { cons_multiply } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function multiply(env: Pick<ExprContext, "valueOf">, ...values: U[]): U {
    const raw = cons_multiply(...values);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
