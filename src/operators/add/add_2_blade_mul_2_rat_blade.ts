import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_BLADE } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { compare_blade_blade, is_blade } from "../blade/BladeExtension";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_rat_blade } from "../mul/is_mul_2_rat_blade";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Blade;
type RL = Rat;
type RR = Blade;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>

//
// j + (Rat * i) => (Rat * i) + j       Case j > i
//               => (Rat + 1) * i       Case i = j
//
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_blade_mul_2_rat_blade', MATH_ADD, is_blade, and(is_cons, is_mul_2_rat_blade), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_BLADE, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        switch (compare_blade_blade(lhs, rhs.rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
            }
            case SIGN_EQ: {
                const sum = rhs.lhs.succ();
                if (sum.isZero()) {
                    return [TFLAG_DIFF, zero];
                }
                if (sum.isOne()) {
                    return [TFLAG_DIFF, lhs];
                }
                return [TFLAG_DIFF, makeList(rhs.opr, sum, lhs)];
            }
            default: {
                return [TFLAG_HALT, expr];
            }
        }
    }
}

export const add_2_blade_mul_2_rat_blade = new Builder();
