
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Rat Sym) => (* Rat Sym) STABLE
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_sym', MATH_MUL, is_rat, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_SYM);
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const lhs = expr.lhs;
            return lhs.isZero() || lhs.isOne();
        }
        else {
            return false;
        }
    }
    isImag(expr: EXP): boolean {
        return this.$.isimag(expr.rhs);
    }
    isScalar(expr: EXP): boolean {
        return this.$.isscalar(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (lhs.isOne()) {
            return [TFLAG_DIFF, rhs];
        }
        return [TFLAG_HALT, expr];
    }
}

export const mul_2_rat_sym = new Builder();
