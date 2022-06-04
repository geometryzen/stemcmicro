import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, TFLAGS } from "../../env/ExtensionEnv";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_num } from "../../operators/num/is_num";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { one, two } from "../../tree/rat/Rat";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { add_num_num } from "../add/add_num_num";

export function do_factorize_rhs(lhs: U, rhs: U, prod: U, orig: U, $: ExtensionEnv): [changed: TFLAGS, expr: U] {
    if (lhs.equals(rhs)) {
        const A = $.valueOf(items_to_cons(MATH_MUL, lhs, prod));
        const B = $.valueOf(items_to_cons(MATH_MUL, two, A));
        return [TFLAG_DIFF, B];
    }
    if (is_num(lhs) && is_num(rhs)) {
        const A = $.valueOf(items_to_cons(MATH_MUL, add_num_num(lhs, rhs), prod));
        return [TFLAG_DIFF, A];
    }
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        if (is_num(lhs.lhs) && lhs.rhs.equals(rhs)) {
            const A = $.valueOf(items_to_cons(MATH_MUL, add_num_num(lhs.lhs, one), rhs));
            const B = $.valueOf(items_to_cons(MATH_MUL, A, prod));
            return [TFLAG_DIFF, B];
        }
        if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
            if (lhs.rhs.equals(rhs.rhs)) {
                return do_factorize_rhs(lhs.lhs, rhs.lhs, $.valueOf(items_to_cons(MATH_MUL, lhs.rhs, prod)), orig, $);
            }
        }
        if (lhs.rhs.equals(rhs)) {
            const A = items_to_cons(MATH_ADD, lhs.lhs, one);
            const B = items_to_cons(MATH_MUL, A, rhs);
            const C = items_to_cons(MATH_MUL, B, prod);
            return [TFLAG_DIFF, C];
        }
    }
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        if (is_num(rhs.lhs) && rhs.rhs.equals(lhs)) {
            const A = $.valueOf(items_to_cons(MATH_MUL, add_num_num(rhs.lhs, one), lhs));
            const B = $.valueOf(items_to_cons(MATH_MUL, A, prod));
            return [TFLAG_DIFF, B];
        }
    }
    return [TFLAG_NONE, orig];
}
