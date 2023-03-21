import { ExtensionEnv, Operator, OperatorBuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { IMU_TYPE, is_imu } from "../imu/is_imu";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = IMU_TYPE;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Sym * Imu may be ordered consistently using compare_factors.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_sym_imu', MATH_MUL, is_sym, is_imu, $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_SYM, MATH_POW);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: EXP): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: EXP): boolean {
        return false;
    }
    isScalar(expr: EXP): boolean {
        const $ = this.$;
        return $.isscalar(expr.lhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        switch ($.compareFn(opr)(lhs, rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_sym_imu = new Builder();
