import { create_int } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { multiply } from "./multiply";

export function negate(_: Pick<ExprContext, "valueOf">, arg: U): U {
    const raw = multiply(_, create_int(-1), arg);
    try {
        return _.valueOf(raw);
    } finally {
        raw.release();
    }
}
