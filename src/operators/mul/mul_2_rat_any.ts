
import { TFLAG_DIFF, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

//
// TODO: We can choose whether to get reuse by extending classes or by containing functions, or both.
//
function multiply_rat_any(lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
    if (lhs.isZero()) {
        return [TFLAG_DIFF, lhs];
    }
    else if (lhs.isOne()) {
        return [TFLAG_DIFF, rhs];
    }
    // TODO: It's important for this to be NOFLAGS rather than STABLE.
    // e.g. Rat*(Blade*Uom) will not be processed further.
    return [NOFLAGS, expr];
}

/**
 * Rat * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_any', MATH_MUL, is_rat, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_ANY);
    }
    isImag(expr: EXPR): boolean {
        const $ = this.$;
        return $.isImag(expr.rhs);
    }
    isReal(expr: EXPR): boolean {
        const $ = this.$;
        return $.isReal(expr.rhs);
    }
    isScalar(expr: EXPR): boolean {
        const $ = this.$;
        return $.isScalar(expr.rhs);
    }
    isVector(expr: EXPR): boolean {
        const $ = this.$;
        return $.isVector(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        return multiply_rat_any(lhs, rhs, expr);
    }
}

export const mul_2_rat_any = new Builder();
