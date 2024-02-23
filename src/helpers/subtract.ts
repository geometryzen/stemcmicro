
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { add } from "./add";
import { negate } from "./negate";

export function subtract(_: Pick<ExprContext, 'valueOf'>, lhs: U, rhs: U): U {
    const negRhs = negate(_, rhs);
    try {
        return add(_, lhs, negRhs);
    }
    finally {
        negRhs.release();
    }
}
