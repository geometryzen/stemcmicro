import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat, two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/rat_extension";
import { is_pow_2_any_rat } from "./is_pow_2_any_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Rat;
type LHS = BCons<Sym, LL, LR>;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_pow_2_any_rat);
const guardR = is_rat;

/**
 * (b**m)**n => b**(m*n), for any positive integers m and n.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_pow_2_any_rat_rat', MATH_POW, guardL, guardR, $);
        this.hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
    isZero(expr: EXP): boolean {
        const b = expr.lhs.lhs;
        return this.$.iszero(b);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const b = lhs.lhs;
        const m = lhs.rhs;
        const n = rhs;
        if (m.isPositiveInteger() && n.isPositiveInteger()) {
            const mn = items_to_cons(MATH_MUL, m, n);
            const retval = items_to_cons(MATH_POW, b, mn);
            return [TFLAG_DIFF, retval];
        }
        if (m.isHalf() && n.equalsRat(two)) {
            return [TFLAG_DIFF, b];
        }
        if (m.isMinusOne() && n.isMinusOne()) {
            return [TFLAG_DIFF, b];
        }
        // console.lg(`${this.name} ${lhs} ${rhs}`);
        return [TFLAG_NONE, expr];
    }
}

export const pow_2_pow_2_any_rat_rat = new Builder();
