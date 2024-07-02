import { ExprContext } from "@stemcmicro/context";
import { cons_add } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function add(env: Pick<ExprContext, "valueOf">, ...args: U[]): U {
    const raw = cons_add(...args);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
