import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { evaluatingTrigAsExp } from "../../modes/modes";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { MATH_ADD, MATH_MUL, MATH_PI, MATH_POW, MATH_SIN } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { MATH_EXP } from "../exp/MATH_EXP";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { is_imu } from "../imu/is_imu";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { is_rat } from "../rat/RatExtension";
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
/*
function is_pi_times_imu(expr: Cons) {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return MATH_PI.equals(lhs) && is_imu(rhs);
    }
    else {
        return false;
    }
}
*/

type LHS = Sym;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (power e X) is equivalent to exp(X)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_e_any', MATH_POW, is_sym, is_any, cross, $);
        this.hash = hash_binop_atom_atom(this.opr, HASH_SYM, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: EXP): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: EXP): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: EXP): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: EXP): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.getModeFlag(evaluatingTrigAsExp)) {
            // Do nothing
        }
        else {
            // Conversion of (power e to trigonometric form, when expanding.
            if ($.isExpanding()) {
                if (is_cons(expo) && is_mul_2_any_any(expo)) {
                    const expo_lhs = expo.lhs;
                    const expo_rhs = expo.rhs;
                    // Euler's identity exp(i * pi), but may not work because of canonical ordering.
                    // TODO: Shouldn't need this since it is a special case of Euler's formula.
                    if (is_imu(expo_lhs)) {
                        if (MATH_PI.equals(expo_rhs)) {
                            // Euler's identity.
                            return [TFLAG_DIFF, negOne];
                        }
                        if ($.isReal(expo_rhs)) {
                            const c = items_to_cons(MATH_COS, expo_rhs);
                            const s = items_to_cons(MATH_SIN, expo_rhs);
                            const i_times_s = items_to_cons(MATH_MUL, imu, s);
                            return [TFLAG_DIFF, items_to_cons(MATH_ADD, c, i_times_s)];
                        }
                    }
                    // Euler's formula
                    // exp(X*i) = cos(X) + i * sin(X)
                    // expo_lhs=X
                    // expo_rhs=i
                    if ($.isReal(expo_lhs) && is_imu(expo_rhs)) {
                        const c = items_to_cons(MATH_COS, expo_lhs);
                        const s = items_to_cons(MATH_SIN, expo_lhs);
                        const s_times_i = items_to_cons(MATH_MUL, s, imu);
                        return [TFLAG_DIFF, items_to_cons(MATH_ADD, c, s_times_i)];
                    }
                    // Euler's formula with rational factor.
                    // exp(k*X*i) = cos(k*X) + i * sin(k*X)
                    // (k * X) * i
                    // expo_lhs=k*X
                    // expo_rhs=i
                    if (is_cons(expo_lhs) && is_opr_2_lhs_any(MATH_MUL, is_rat)(expo_lhs) && $.isReal(expo_lhs.rhs) && is_imu(expo_rhs)) {
                        //
                        // const k = expo_lhs.lhs;
                        // const X = expo_lhs.rhs;
                        const c = items_to_cons(MATH_COS, expo_lhs);
                        const s = items_to_cons(MATH_SIN, expo_lhs);
                        const s_times_i = items_to_cons(MATH_MUL, s, imu);
                        return [TFLAG_DIFF, items_to_cons(MATH_ADD, c, s_times_i)];
                    }
                }
            }
            if ($.isFactoring()) {
                // console.lg(`${this.name} FACTORING focus=${$.getFocus()}`);
                return [TFLAG_DIFF, items_to_cons(MATH_EXP, expo)];
            }
        }
        return [TFLAG_NONE, expr];
    }
}

export const pow_2_e_any = new Builder();
