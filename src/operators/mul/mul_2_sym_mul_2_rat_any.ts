import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_rat_any } from "./is_mul_2_rat_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const mul_2_sym_mul_2_rat_any = new Builder();

/**
 * a * (n * X) => n * (a * X), where n is a number, a is a symbol, and X is anything.
 */
class Op extends Function2<Sym, BCons<Sym, Rat, U>> implements Operator<BCons<Sym, Sym, BCons<Sym, Rat, U>>> {
    constructor($: ExtensionEnv) {
        super('mul_2_sym_mul_2_rat_any', MATH_MUL, is_sym, and(is_cons, is_mul_2_rat_any), $);
    }
    cost(expr: BCons<Sym, Sym, BCons<Sym, Rat, U>>, costs: CostTable, depth: number): number {
        // The extra cost is because the expression that is matched is not canonical.
        return super.cost(expr, costs, depth) + 1;
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Rat, U>): [TFLAGS, U] {
        const a = lhs;
        const n = rhs.lhs;
        const X = rhs.rhs;
        const aX = makeList(rhs.opr, a, X);
        const naX = makeList(opr, n, aX);
        return [CHANGED, naX];
    }
}
