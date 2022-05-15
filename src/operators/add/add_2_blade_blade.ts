import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { compare_blades, is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";

type LHS = Blade;
type RHS = Blade;
type EXPR = BCons<Sym, LHS, RHS>;

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: LHS, rhs: RHS): boolean {
    switch (compare_blades(lhs, rhs)) {
        case SIGN_GT:
        case SIGN_EQ: {
            return true;
        }
        default: {
            return false;
        }
    }
}

/**
 * Blade + Blade
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('add_2_blade_blade', MATH_ADD, is_blade, is_blade, cross, $);
    }
    cost(expr: EXPR, costTable: CostTable, depth: number): number {
        return super.cost(expr, costTable, depth) + 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: LHS): [TFLAGS, U] {
        if (lhs.equals(rhs)) {
            return [CHANGED, makeList(MATH_MUL, two, lhs)];
        }
        else {
            // We are here because the blades are not in canonical order.
            return [CHANGED, makeList(opr, rhs, lhs)];
        }
    }
}

export const add_2_blade_blade = new Builder();
