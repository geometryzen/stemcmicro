
import { CostTable } from "../../env/CostTable";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat, zero } from "../../tree/rat/Rat";
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

type LHS = Sym;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Sym Rat) => (* Rat Sym)
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_sym_rat', MATH_MUL, is_sym, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_SYM, HASH_RAT);
    }
    cost(expr: EXP, costs: CostTable, depth: number): number {
        const baseCost = super.cost(expr, costs, depth);
        return baseCost + 1;
    }
    isScalar(expr: EXP): boolean {
        return this.$.isScalar(expr.lhs);
    }
    isVector(expr: EXP): boolean {
        return this.$.isVector(expr.lhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        // If the base class binds the symbol to something else then none of this code below will be called.
        // Therefore, you can consider that this code only applies to unbound symbols. 
        if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_sym_rat = new Builder();
