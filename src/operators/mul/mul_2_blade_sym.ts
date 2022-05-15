
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = Sym;
type EXPR = BCons<Sym, LHS, RHS>

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isScalar(rhs);
    };
}

/**
 * Blade * Sym => Sym * Blade
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('mul_2_blade_sym', MATH_MUL, is_blade, is_sym, cross($), $);
    }
    cost(expr: EXPR, costs: CostTable, depth: number): number {
        return super.cost(expr, costs, depth) + 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [CHANGED, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_blade_sym = new Builder();
