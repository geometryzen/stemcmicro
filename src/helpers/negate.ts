import { create_int } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { multiply } from "./multiply";

export function negate(arg: U, env: Pick<ExprContext, 'valueOf'>): U {
    const raw = multiply(env, create_int(-1), arg);
    try {
        return env.valueOf(raw);
    }
    finally {
        raw.release();
    }
}
