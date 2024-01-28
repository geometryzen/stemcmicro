import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
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
type LHS = Cons2<Sym, LL, LR>;
type RL = Rat;
type RR = Sym;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

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
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_mul_2_rat_sym', MATH_ADD, and(is_cons, is_add_2_any_sym), and(is_cons, is_mul_2_rat_sym), cross, $);
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_ADD, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const c = lhs.rhs;
        const b = rhs.rhs;
        const k = rhs.lhs;
        switch (c.compare(b)) {
            case SIGN_GT: {
                const retval = $.valueOf(items_to_cons(MATH_ADD, $.valueOf(items_to_cons(MATH_ADD, X, rhs)), c));
                return [TFLAG_DIFF, retval];
            }
            default: {
                const retval = $.valueOf(items_to_cons(MATH_ADD, X, $.valueOf(items_to_cons(MATH_MUL, k.succ(), c))));
                return [TFLAG_DIFF, retval];
            }
        }
    }
}

export const add_2_add_2_any_mul_2_rat_sym = new Builder();
