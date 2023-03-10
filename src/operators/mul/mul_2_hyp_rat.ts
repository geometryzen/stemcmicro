
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_HYP, HASH_RAT } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Hyp } from "../../tree/hyp/Hyp";
import { is_rat } from "../rat/is_rat";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_hyp } from "../hyp/is_hyp";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Hyp;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Hyp Rat) => (* Rat Hyp)
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_hyp_rat', MATH_MUL, is_hyp, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_HYP, HASH_RAT);
    }
    isScalar(expr: EXP): boolean {
        return this.$.isScalar(expr.lhs);
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

export const mul_2_hyp_rat = new Builder();
