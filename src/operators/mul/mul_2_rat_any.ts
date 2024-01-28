
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

//
// TODO: We can choose whether to get reuse by extending classes or by containing functions, or both.
//
function multiply_rat_any(lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
    if (lhs.isZero()) {
        return [TFLAG_DIFF, lhs];
    }
    else if (lhs.isOne()) {
        return [TFLAG_DIFF, rhs];
    }
    // TODO: It's important for this to be NOFLAGS rather than STABLE.
    // e.g. Rat*(Blade*Uom) will not be processed further.
    return [TFLAG_NONE, expr];
}

/**
 * Rat * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_any', MATH_MUL, is_rat, is_any, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
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
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        return multiply_rat_any(lhs, rhs, expr);
    }
}

export const mul_2_rat_any = new Builder();
