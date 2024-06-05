import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { add } from "./add";
import { negate } from "./negate";

export function subtract(_: Pick<ExprContext, "valueOf">, lhs: U, rhs: U): U {
    const negRhs = negate(_, rhs);
    try {
        return add(_, lhs, negRhs);
    } finally {
        negRhs.release();
    }
}
