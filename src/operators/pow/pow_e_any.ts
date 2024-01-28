import { count_imu_factors } from "../../calculators/count_imu_factors";
import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { divide_by_imu } from "../../optimize/divide_by_imu";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { MATH_ADD, MATH_MUL, MATH_POW, MATH_SIN } from "../../runtime/ns_math";
import { negOne, one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { MATH_EXP } from "../exp/MATH_EXP";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { is_imu } from "../imu/is_imu";
import { is_cons_opr_eq_mul } from "../mul/is_cons_opr_eq_mul";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { is_pi } from "../pi/is_pi";
import { is_rat } from "../rat/rat_extension";
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
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (math.pow e X) is equivalent to exp(X)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('pow_e_any', MATH_POW, is_sym, is_any, cross, $);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_SYM, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, base: LHS, expo: RHS, outerExpr: EXP): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(base), this.$.toInfixString(expo));
        const $ = this.$;
        aggressive(expo, outerExpr, $);
        if ($.getDirective(Directive.familiarize)) {
            return [TFLAG_DIFF, items_to_cons(MATH_EXP, expo)];
        }
        return [TFLAG_NONE, outerExpr];
    }
}

function aggressive(expo: RHS, outerExpr: EXP, $: ExtensionEnv) {
    if ($.getDirective(Directive.complexAsPolar)) {
        // Do nothing
    }
    else if ($.getDirective(Directive.convertTrigToExp)) {
        // Do nothing
    }
    else {
        // Conversion of (pow e to trigonometric form, when expanding.
        if ($.isExpanding()) {
            // TODO: We could also consider the case of blades whose square is -1.
            if (is_imu(expo)) {
                const c = items_to_cons(MATH_COS, one);
                const s = items_to_cons(MATH_SIN, one);
                const i_times_s = items_to_cons(MATH_MUL, imu, s);
                return [TFLAG_DIFF, items_to_cons(MATH_ADD, c, i_times_s)];
            }
            // The following block of code is not very general because it assumes that the exponent
            // involves only binary multiplication. This would only occur in simple cases
            // or when the association of multiplication is explicit.
            if (is_cons(expo) && is_mul_2_any_any(expo)) {
                const expo_lhs = expo.lhs;
                const expo_rhs = expo.rhs;
                // Euler's identity exp(i * pi), but may not work because of canonical ordering.
                // TODO: Shouldn't need this since it is a special case of Euler's formula.
                if (is_imu(expo_lhs)) {
                    if (is_pi(expo_rhs)) {
                        // Euler's identity.
                        // console.lg(`Euler 1`);
                        return [TFLAG_DIFF, negOne];
                    }
                    if ($.isreal(expo_rhs)) {
                        // console.lg(`Euler 2`);
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
                if ($.isreal(expo_lhs) && is_imu(expo_rhs)) {
                    const c = $.valueOf(items_to_cons(MATH_COS, expo_lhs));
                    const s = $.valueOf(items_to_cons(MATH_SIN, expo_lhs));
                    const s_times_i = $.valueOf(items_to_cons(MATH_MUL, s, imu));
                    return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_ADD, c, s_times_i))];
                }
                // Euler's formula with rational factor.
                // exp(k*X*i) = cos(k*X) + i * sin(k*X)
                // (k * X) * i
                // expo_lhs=k*X
                // expo_rhs=i
                if (is_cons(expo_lhs) && is_opr_2_lhs_any(MATH_MUL, is_rat)(expo_lhs) && $.isreal(expo_lhs.rhs) && is_imu(expo_rhs)) {
                    // console.lg(`Euler 4`);
                    //
                    // const k = expo_lhs.lhs;
                    // const X = expo_lhs.rhs;
                    const c = items_to_cons(MATH_COS, expo_lhs);
                    const s = items_to_cons(MATH_SIN, expo_lhs);
                    const s_times_i = items_to_cons(MATH_MUL, s, imu);
                    return [TFLAG_DIFF, items_to_cons(MATH_ADD, c, s_times_i)];
                }
                if (is_cons(expo_rhs) && is_cons_opr_eq_sym(expo_rhs, native_sym(Native.log))) {
                    // exp(a*log(b)) = b^a
                    const a = expo_lhs;
                    const b = expo_rhs.argList.head;
                    return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_POW, b, a))];
                }
            }
            if (is_cons(expo) && is_cons_opr_eq_mul(expo)) {
                const N = count_imu_factors(expo);
                if (N === 1) {
                    const x = divide_by_imu(expo, $);
                    return [TFLAG_DIFF, euler_formula(x, $)];
                }
            }
        }
    }
    return [TFLAG_NONE, outerExpr];
}

function euler_formula(x: U, $: ExtensionEnv): U {
    const c = $.valueOf(items_to_cons(MATH_COS, x));
    const s = $.valueOf(items_to_cons(MATH_SIN, x));
    const i_times_s = $.valueOf(items_to_cons(MATH_MUL, imu, s));
    return $.valueOf(items_to_cons(MATH_ADD, c, i_times_s));

}

export const pow_e_any = new Builder();

