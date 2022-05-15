
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { binswap } from "../helpers/binswap";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Sym + Rat => Rat + Sym
 */
class Op extends Function2<Sym, Rat> implements Operator<BCons<Sym, Sym, Rat>> {
    constructor($: ExtensionEnv) {
        super('add_2_sym_rat', MATH_ADD, is_sym, is_rat, $);
    }
    cost(expr: BCons<Sym, Sym, Rat>, costs: CostTable, depth: number): number {
        const baseCost = super.cost(expr, costs, depth);
        return baseCost + 1;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Rat, orig: BCons<Sym, Sym, Rat>): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [CHANGED, lhs];
        }
        else {
            return [CHANGED, binswap(orig)];
        }
    }
}

export const add_2_sym_rat = new Builder();
