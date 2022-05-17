import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
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

type LHS = Sym;
type RHS = Flt;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Sym Flt) => (* Flt Sym)
 *             => 0 if Flt is zero
 *             => Sym if Flt is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt'];
    constructor($: ExtensionEnv) {
        super('mul_2_sym_flt', MATH_MUL, is_sym, is_flt, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_SYM, HASH_FLT);
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
            return [CHANGED, zero];
        }
        if (rhs.isOne()) {
            return [CHANGED, lhs];
        }
        return [CHANGED, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_sym_flt = new Builder();
