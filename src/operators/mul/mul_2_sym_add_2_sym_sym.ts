import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_add_2_sym_sym } from "../add/is_add_2_sym_sym";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * a * (b + c) => (a * b) + (a * c)
 * 
 * TODO: This Operator duplicates mul_lhs_distrib_over_add_expand, but is is optimized for symbols.
 * Ideally it should be consolidated. 
 */
class Op extends Function2<Sym, BCons<Sym, Sym, Sym>> implements Operator<BCons<Sym, Sym, BCons<Sym, Sym, Sym>>> {
    constructor($: ExtensionEnv) {
        super('mul_2_sym_add_2_sym_sym', MATH_MUL, is_sym, and(is_cons, is_add_2_sym_sym), $);
    }
    cost(expr: BCons<Sym, Sym, BCons<Sym, Sym, Sym>>, costs: CostTable, depth: number): number {
        // Because we are dealing in Sym(bols) we can get the costs directly from the cost table.
        // We could go through the environment ($) but that would be less efficient.
        return super.cost(expr, costs, depth) + costs.getCost(MATH_MUL, this.$) + costs.getCost(expr.lhs, this.$);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Sym>, expr: BCons<Sym, Sym, BCons<Sym, Sym, Sym>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            const ab = makeList(opr, a, b);
            const ac = makeList(opr, a, c);
            return [CHANGED, makeList(rhs.opr, ab, ac)];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_sym_add_2_sym_sym = new Builder();
