
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { is_num } from "../../predicates/is_num";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = Num;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * Blade * Num => Num * Blade
 */
class Op extends Function2<Blade, Num> implements Operator<EXPR> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('mul_2_blade_num', MATH_MUL, is_blade, is_num, $);
    }
    cost(expr: EXPR, costTable: CostTable, depth: number): number {
        return super.cost(expr, costTable, depth) + 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [CHANGED, $.valueOf(makeList(opr, rhs, lhs))];
    }
}

export const mul_2_blade_num = new Builder();
