import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { negOne, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_inner_2_sym_sym } from "../mul/is_mul_2_rat_inner_2_sym_sym";
import { is_mul_2_sym_sym } from "../mul/is_mul_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = Sym;
type LR = Sym;
type LHS = BCons<Sym, LL, LR>;
type RL = Rat;
type RRL = Sym;
type RRR = Sym;
type RR = BCons<Sym, RRL, RRR>;
type RHS = BCons<Sym, RL, RR>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.isFactoring()) {
            const a1 = lhs.lhs;
            const b1 = lhs.rhs;
            const a2 = rhs.rhs.lhs;
            const b2 = rhs.rhs.rhs;
            const num = rhs.lhs;
            if (num.isIntegerNumber(-2) && a1.equalsSym(a2) && b1.equals(b2)) {
                return $.treatAsVector(a1) && $.treatAsVector(b1);
            }
            return false;
        }
        else {
            return false;
        }
    };
}

/**
 * a * b - 2 (a | b) => - b * a
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('factorize_ab_minus_two_a_dot_b', MATH_ADD, and(is_cons, is_mul_2_sym_sym), and(is_cons, is_mul_2_rat_inner_2_sym_sym), cross($), $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs.lhs;
        const b = lhs.rhs;
        const ba = $.valueOf(makeList(MATH_MUL, b, a));
        return [CHANGED, $.valueOf(makeList(MATH_MUL, negOne, ba))];
    }
}

export const factorize_ab_minus_two_a_dot_b = new Builder();
