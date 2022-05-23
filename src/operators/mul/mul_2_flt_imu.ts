
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_FLT } from "../../hashing/hash_info";
import { is_imu } from "../../predicates/is_imu";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/FltExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Flt * i
 */
class Op extends Function2<Flt, BCons<Sym, Rat, Rat>> implements Operator<Cons> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Imu'];
    constructor($: ExtensionEnv) {
        super('mul_2_flt_imu', MATH_MUL, is_flt, is_imu, $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_FLT, MATH_POW);
    }
    transform2(opr: Sym, lhs: Flt, rhs: BCons<Sym, Rat, Rat>, expr: BCons<Sym, Flt, BCons<Sym, Rat, Rat>>): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (lhs.isOne()) {
            return [TFLAG_DIFF, rhs];
        }
        return [TFLAG_HALT, expr];
    }
}

export const mul_2_flt_imu = new Builder();
