import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { binswap } from "../helpers/binswap";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_imu_sym } from "../mul/is_mul_2_imu_sym";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (i * x) + y => y + (i * x)
 */
class Op extends Function2<BCons<Sym, BCons<Sym, Rat, Rat>, Sym>, Sym> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_imu_sym_sym', MATH_ADD, and(is_cons, is_mul_2_imu_sym), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: BCons<Sym, BCons<Sym, Rat, Rat>, Sym>, rhs: Sym, orig: BCons<Sym, BCons<Sym, BCons<Sym, Rat, Rat>, Sym>, Sym>): [TFLAGS, U] {
        return [CHANGED, binswap(orig)];
    }
}

export const add_2_mul_2_imu_sym_sym = new Builder();
