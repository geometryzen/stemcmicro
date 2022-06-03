import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_IMU } from "../../hashing/hash_info";
import { IMU_TYPE, is_imu } from "../../predicates/is_imu";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = IMU_TYPE;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * X | i => (1 | X) * i
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_2_any_imu', MATH_INNER, is_any, is_imu, $);
        this.hash = hash_binop_atom_atom(MATH_INNER, HASH_ANY, HASH_IMU);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs;
        const i = rhs;
        const inrP = $.valueOf(makeList(opr, one, X));
        const retval = $.valueOf(makeList(MATH_MUL, inrP, i));
        return [TFLAG_DIFF, retval];
    }
}

export const inner_2_any_imu = new Builder();
