import { CHANGED, ExtensionEnv, FEATURE, Operator, OperatorBuilder, PHASE_FLAGS_TRANSFORM, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_FLT } from "../../hashing/hash_info";
import { is_imu } from "../../predicates/is_imu";
import { MATH_ADD, MATH_POW } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, Rat, Rat>;
type RHS = Flt;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Imu + Flt => Flt + Imu
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FLAGS_TRANSFORM;
    readonly dependencies: FEATURE[] = ['Flt', 'Imu'];
    constructor($: ExtensionEnv) {
        super('add_2_imu_flt', MATH_ADD, is_imu, is_flt, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_POW, HASH_FLT);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [CHANGED, makeList(opr, rhs, lhs)];
    }
}

export const add_2_imu_flt = new Builder();
