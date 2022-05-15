import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";
import { is_add_2_any_sym } from "./is_add_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Sym;
type LHS = BCons<Sym, LL, LR>;
type RL = Rat;
type RR = Sym;
type RHS = BCons<Sym, RL, RR>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    switch (lhs.rhs.compare(rhs.rhs)) {
        case SIGN_GT:
        case SIGN_EQ: {
            return true;
        }
        default: {
            return false;
        }
    }
}

/**
 * (X + c) + (k * b) => (X + (k * b)) + c
 * (X + c) + (k * c) => X + (K + 1) * c
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_mul_2_rat_sym', MATH_ADD, and(is_cons, is_add_2_any_sym), and(is_cons, is_mul_2_rat_sym), cross, $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const c = lhs.rhs;
        const b = rhs.rhs;
        const k = rhs.lhs;
        switch (c.compare(b)) {
            case SIGN_GT: {
                const retval = $.valueOf(makeList(MATH_ADD, $.valueOf(makeList(MATH_ADD, X, rhs)), c));
                return [CHANGED, retval];
            }
            default: {
                const retval = $.valueOf(makeList(MATH_ADD, X, $.valueOf(makeList(MATH_MUL, k.succ(), c))));
                return [CHANGED, retval];
            }
        }
    }
}

export const add_2_add_2_any_mul_2_rat_sym = new Builder();
