import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, SIGN_GT, SIGN_LT, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
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
 * b + a => a + b
 * a + a => 2 * a
 */
class Op extends Function2<Sym, Sym> implements Operator<BCons<Sym, Sym, Sym>> {
    constructor($: ExtensionEnv) {
        super('add_2_sym_sym', MATH_ADD, is_sym, is_sym, $);
    }
    cost(expr: BCons<Sym, Sym, Sym>, costs: CostTable, depth: number): number {
        const baseCost = super.cost(expr, costs, depth);
        switch (compare_sym_sym(expr.lhs, expr.rhs)) {
            case SIGN_GT: {
                return baseCost + 1;
            }
            case SIGN_LT: {
                return baseCost;
            }
            default: {
                if (expr.lhs.equals(expr.rhs)) {
                    return baseCost + 1;
                }
                else {
                    return baseCost;
                }
            }
        }
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, orig: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        switch (compare_sym_sym(lhs, rhs)) {
            case SIGN_GT: {
                return [CHANGED, makeList(opr, rhs, lhs)];
            }
            case SIGN_LT: {
                return [STABLE, orig];
            }
            default: {
                if (lhs.equals(rhs)) {
                    return [CHANGED, makeList(MATH_MUL.clone(opr.pos, opr.end), two, lhs)];
                }
                else {
                    return [STABLE, orig];
                }
            }
        }
    }
}

export const add_2_sym_sym = new Builder();
