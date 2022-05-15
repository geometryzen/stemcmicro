
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { is_num } from "../../predicates/is_num";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Sym * Num => Num * Sym
 */
class Op extends Function2<Sym, Num> implements Operator<BCons<Sym, Sym, Num>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_sym_num', MATH_MUL, is_sym, is_num, $);
        this.hash = `(* Sym Num)`;
    }
    cost(expr: BCons<Sym, Sym, Num>, costs: CostTable, depth: number): number {
        const baseCost = super.cost(expr, costs, depth);
        return baseCost + 1;
    }
    isScalar(expr: BCons<Sym, Sym, Num>): boolean {
        return this.$.isScalar(expr.lhs);
    }
    isVector(expr: BCons<Sym, Sym, Num>): boolean {
        return this.$.isVector(expr.lhs);
    }
    transform2(opr: Sym, lhs: Sym, rhs: Num): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [CHANGED, zero];
        }
        if (rhs.isOne()) {
            return [CHANGED, lhs];
        }
        return [CHANGED, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_sym_num = new Builder();
