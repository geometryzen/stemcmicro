import { CostTable } from "../../env/CostTable";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_POW } from "../../runtime/ns_math";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_SQRT } from "./MATH_SQRT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Sqrt($);
    }
}

type ARG = U;
type EXPR = UCons<Sym, ARG>;

/**
 * sqrt(x) => (power x 1/2)
 */
class Sqrt extends Function1<ARG> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('sqrt_1_any', MATH_SQRT, is_any, $);
    }
    cost(expr: EXPR, costs: CostTable, depth: number): number {
        return super.cost(expr, costs, depth) + 1 + 1;
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, this.$.valueOf(makeList(MATH_POW, arg, half))];
    }
}

export const sqrt_1_any = new Builder();
