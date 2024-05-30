import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { add } from "../../helpers/add";
import { negate } from "../../helpers/negate";

export function subtract(lhs: U, rhs: U, _: Pick<ExprContext, "valueOf">): U {
    const hook = function (retval: U): U {
        return retval;
    };
    const A = negate(_, rhs);
    const B = add(_, lhs, A);
    return hook(B);
}
