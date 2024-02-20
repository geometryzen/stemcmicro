import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { add } from "../../helpers/add";
import { negate } from "../../helpers/negate";

export function subtract(lhs: U, rhs: U, _: Pick<ExprContext, 'valueOf'>): U {
    const hook = function (retval: U): U {
        return retval;
    };
    const A = negate(rhs, _);
    const B = add(_, lhs, A);
    return hook(B);
}
