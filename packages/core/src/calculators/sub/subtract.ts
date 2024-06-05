import { ExprContext } from "@stemcmicro/context";
import { add, negate } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";

export function subtract(lhs: U, rhs: U, _: Pick<ExprContext, "valueOf">): U {
    const hook = function (retval: U): U {
        return retval;
    };
    const A = negate(_, rhs);
    const B = add(_, lhs, A);
    return hook(B);
}
