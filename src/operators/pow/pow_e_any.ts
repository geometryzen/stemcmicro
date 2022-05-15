import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { is_imu } from "../../predicates/is_imu";
import { MATH_ADD, MATH_MUL, MATH_PI, MATH_POW, MATH_SIN } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross(lhs: Sym, rhs: U): boolean {
    return is_base_of_natural_logarithm(lhs);
}

function is_imu_times_pi(expr: Cons) {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_imu(lhs) && MATH_PI.equals(rhs);
    }
    else {
        return false;
    }
}

class Op extends Function2X<Sym, U> implements Operator<BCons<Sym, Sym, U>> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('pow_2_e_any', MATH_POW, is_sym, is_any, cross, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: BCons<Sym, Sym, U>): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: BCons<Sym, Sym, U>): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, base: Sym, expo: U, oldExpr: BCons<Sym, Sym, U>): [TFLAGS, U] {
        const $ = this.$;
        if (is_cons(expo) && is_mul_2_any_any(expo)) {
            const expo_lhs = expo.lhs;
            const expo_rhs = expo.rhs;
            if (is_imu(expo_lhs)) {
                if (MATH_PI.equals(expo_rhs)) {
                    // Euler's identity.
                    return [CHANGED, negOne];
                }
                if ($.isReal(expo_rhs)) {
                    const c = makeList(MATH_COS, expo_rhs);
                    const s = makeList(MATH_SIN, expo_rhs);
                    const i_times_s = makeList(MATH_MUL, imu, s);
                    return [CHANGED, makeList(MATH_ADD, c, i_times_s)];
                }
            }
            if (is_cons(expo_lhs) && is_imu_times_pi(expo_lhs)) {
                if ($.isReal(expo_rhs)) {
                    const c = makeList(MATH_COS, expo_rhs);
                    const s = makeList(MATH_SIN, expo_rhs);
                    const i_times_s = makeList(MATH_MUL, imu, s);
                    return [CHANGED, makeList(MATH_ADD, c, i_times_s)];
                }
            }
        }
        return [NOFLAGS, oldExpr];
    }
}

export const pow_2_e_any = new Builder();
