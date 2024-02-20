
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { add } from "./add";
import { negate } from "./negate";

export function subtract(lhs: U, rhs: U, env: Pick<ExprContext, 'valueOf'>): U {
    const negRhs = negate(rhs, env);
    try {
        return add(env, lhs, negRhs);
    }
    finally {
        negRhs.release();
    }
}
