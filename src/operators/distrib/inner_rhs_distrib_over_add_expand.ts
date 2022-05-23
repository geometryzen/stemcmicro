
import { CostTable } from "../../env/CostTable";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD, MATH_INNER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * (a + b) | c => (a | c) + (b | c)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_rhs_distrib_over_add_expand', MATH_INNER, and(is_cons, is_opr_2_any_any(MATH_ADD)), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_INNER, MATH_ADD, HASH_ANY);
    }
    cost(expr: EXPR, costs: CostTable, depth: number): number {
        // TODO: The cost should only be higher if we are expanding this pattern.
        const $ = this.$;
        const c = expr.rhs;

        return super.cost(expr, costs, depth) + $.cost(c, depth + 1) + $.cost(MATH_INNER, depth + 1);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        const ac = makeList(opr, a, c);
        const bc = makeList(opr, b, c);
        const retval = makeList(lhs.opr, ac, bc);
        return [TFLAG_DIFF, retval];
    }
}

export const inner_rhs_distrib_over_add_expand = new Builder();
