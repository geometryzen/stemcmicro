import { imu } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { negate } from "./helpers/negate";
import { subst } from "./operators/subst/subst";

export function complex_conjugate(expr: U, _: Pick<ExprContext, "handlerFor" | "valueOf">): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, where: string): U {
        // console.lg(`conj of ${$.toInfixString(z)} => ${$.toInfixString(retval)} (${where})`);
        return retval;
    };

    const minus_i = negate(_, imu);
    const z_star = subst(expr, imu, minus_i, _);
    return hook(_.valueOf(z_star), "");
}
