import { add_num_num } from "../../calculators/add/add_num_num";
import { TFLAG_DIFF, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";
import { is_add_2_any_mul_2_rat_sym } from "./is_add_2_any_mul_2_rat_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}


type LRL = Rat;
type LRR = Sym;
type LR = BCons<Sym, LRL, LRR>
type LL = U;
type LHS = BCons<Sym, LL, LR>;
type RR = Sym;
type RL = Rat;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>

function cross(lhs: LHS, rhs: RHS): boolean {
    const x1 = lhs.rhs.rhs;
    const x2 = rhs.rhs;
    switch (x1.compare(x2)) {
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
 * (a + m * z) + (n * b)   (GT case)
 * (a + m * b) + (n * b)   (EQ case)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym', MATH_ADD, and(is_cons, is_add_2_any_mul_2_rat_sym), and(is_cons, is_mul_2_rat_sym), cross, $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_ADD, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const x1 = lhs.rhs.rhs;
        const x2 = rhs.rhs;
        switch (x1.compare(x2)) {
            case SIGN_GT: {
                const a = lhs.lhs;
                const Z = lhs.rhs;
                const X = rhs;
                const aX = makeList(MATH_ADD, a, X);
                const retval = makeList(MATH_ADD, aX, Z);
                return [TFLAG_DIFF, retval];
            }
            // The remaining branches aren't being covered.
            // The EQ case should be generalized anyway
            case SIGN_EQ: {
                const a = lhs.lhs;
                const b = rhs.rhs;
                const m = lhs.rhs.lhs;
                const n = rhs.lhs;
                return [TFLAG_DIFF, makeList(MATH_ADD, a, makeList(MATH_MUL, add_num_num(m, n), b))];
            }
            default: {
                // This should be dead code.
                return [NOFLAGS, orig];
            }
        }
    }
}

export const add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym = new Builder();
