import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_hyp } from "../hyp/is_hyp";
import { is_pow_2_any_rat } from "../pow/is_pow_2_any_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RL = U;
type RR = Rat;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const X1 = lhs;
    const X2 = rhs.lhs;
    if (is_sym(X1) || is_hyp(X1)) {
        return X1.equals(X2);
    }
    else {
        return false;
    }
}

/**
 * Looping can occur e.g. X = -1, k = 1/2.
 * 
 * X * (X ** k) => X ** (k + 1)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_X_pow_2_X_rat', MATH_MUL, is_any, and(is_cons, is_pow_2_any_rat), cross, $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_ANY, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        // console.log(`${this.name} exp=${print_expr(exp, $)}`);
        const X = lhs;
        const k = rhs.rhs;
        const p1 = makeList(rhs.opr, X, k.succ());
        // console.log(`p1=${print_expr(p1, $)}`);
        const p2 = $.valueOf(p1);
        return [TFLAG_DIFF, p2];
    }
}

export const mul_2_X_pow_2_X_rat = new Builder();
