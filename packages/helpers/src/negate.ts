import { create_int } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { multiply } from "./multiply";

export function negate(env: Pick<ExprContext, "valueOf">, arg: U): U {
    const raw = multiply(env, create_int(-1), arg);
    try {
        return env.valueOf(raw);
    } finally {
        raw.release();
    }
}
