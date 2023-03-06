
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_IMU } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/flt_extension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { IMU_TYPE, is_imu } from "../imu/is_imu";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = IMU_TYPE;
type RHS = Flt;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Imu * Flt
 */
class Op extends Function2<LHS, RHS> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Imu'];
    constructor($: ExtensionEnv) {
        super('mul_2_imu_flt', MATH_MUL, is_imu, is_flt, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_IMU, HASH_FLT);
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const rhs = expr.rhs;
            if (rhs.isZero()) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, rhs];
    }
}

export const mul_2_imu_flt = new Builder();
