import { create_int } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { multiply } from "./multiply";

export function negate(_: Pick<ExprContext, "valueOf">, arg: U): U {
    const raw = multiply(_, create_int(-1), arg);
    try {
        return _.valueOf(raw);
    } finally {
        raw.release();
    }
}
