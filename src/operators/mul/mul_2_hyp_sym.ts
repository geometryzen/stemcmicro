
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_HYP, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_hyp } from "../hyp/is_hyp";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Hyp;
type RHS = Sym;
type EXPR = BCons<Sym, LHS, RHS>

/**
 * Hyp * Sym => Sym * Hyp
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv) {
        super('mul_2_hyp_sym', MATH_MUL, is_hyp, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_HYP, HASH_SYM);
    }
    cost(expr: EXPR, costs: CostTable, depth: number): number {
        return super.cost(expr, costs, depth) + 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [CHANGED, $.valueOf(makeList(opr, rhs, lhs))];
    }
}

export const mul_2_hyp_sym = new Builder();
