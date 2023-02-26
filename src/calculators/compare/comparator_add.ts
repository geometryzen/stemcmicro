import { ExprComparator, ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { compare_blade_blade } from "../../operators/blade/blade_extension";
import { is_blade } from "../../operators/blade/is_blade";
import { is_imu } from "../../operators/imu/is_imu";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { is_num } from "../../operators/num/is_num";
import { is_tensor } from "../../operators/tensor/is_tensor";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_cons, U } from "../../tree/tree";
import { count_factors } from "../count_factors";
import { canonical_factor_num_lhs, canonical_factor_num_rhs } from "../factorize/canonical_factor_num";
import { remove_factors } from "../remove_factors";
import { cmp_expr } from "./cmp_expr";
import { compare_num_num } from "./compare_num_num";
import { contains_single_blade } from "./contains_single_blade";
import { extract_single_blade } from "./extract_single_blade";

export class AddComparator implements ExprComparator {
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign {
        const lhsR = canonical_factor_num_rhs(lhs);
        const rhsR = canonical_factor_num_rhs(rhs);
        switch (cmp_terms_core(lhsR, rhsR, $)) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            case SIGN_EQ: {
                // If two terms, apart from numeric factors, are equal then it really does not matter too much
                // how they are sorted because they are destined to be combined through addition.
                // TODO: When tests are passing, try removing this code and returning SIGN_EQ.
                // In other words do we ever have sums where adjacent terms differ only in numerical factors?
                const lhsL = canonical_factor_num_lhs(lhs);
                const rhsL = canonical_factor_num_lhs(rhs);
                return compare_num_num(lhsL, rhsL);
            }
        }
    }
}

/**
 * @deprecated
 */
export function cmp_terms(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    return $.compareFn(MATH_ADD)(lhs, rhs);
}

export function cmp_terms_core(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    // console.lg("ENTERING", "cmp_terms", "lhs", render_as_sexpr(lhs, $), "rhs", render_as_sexpr(rhs, $));
    // numbers can be combined
    if (lhs.equals(rhs)) {
        return SIGN_EQ;
    }

    if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
        const bladeL = extract_single_blade(lhs);
        const bladeR = extract_single_blade(rhs);
        if (bladeL.equals(lhs) && bladeR.equals(rhs)) {
            return compare_blade_blade(bladeL, bladeR);
        }
        else {
            switch (cmp_terms(bladeL, bladeR, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    return cmp_terms(remove_factors(lhs, is_blade), remove_factors(rhs, is_blade), $);
                }
            }
        }
    }

    if (contains_single_blade(lhs)) {
        return SIGN_GT;
    }

    if (contains_single_blade(rhs)) {
        return SIGN_LT;
    }

    if (contains_single_imu(lhs) && contains_single_imu(rhs)) {
        return cmp_terms(remove_factors(lhs, is_imu), remove_factors(rhs, is_imu), $);
    }

    // These probably belong in general expression comparision.
    if (contains_single_imu(lhs)) {
        return SIGN_GT;
    }

    if (contains_single_imu(rhs)) {
        return SIGN_LT;
    }

    if (is_num(lhs) && is_num(rhs)) {
        return SIGN_EQ;
    }

    // congruent tensors can be combined

    if (is_tensor(lhs) && is_tensor(rhs)) {
        if (lhs.rank < rhs.rank) {
            return SIGN_LT;
        }
        if (lhs.rank > rhs.rank) {
            return SIGN_GT;
        }
        const rank = lhs.rank;
        for (let i = 0; i < rank; i++) {
            if (lhs.dim(i) < rhs.dim(i)) {
                return SIGN_LT;
            }
            if (lhs.dim(i) > rhs.dim(i)) {
                return SIGN_GT;
            }
        }
        return SIGN_EQ;
    }

    const lhsPart = canonical_factor_num_rhs(lhs);
    const rhsPart = canonical_factor_num_rhs(rhs);

    // I'd still like to compare as terms, but that would be recursive if we don't have a termination condition.
    if (lhsPart.equals(lhs) && rhsPart.equals(rhs)) {
        return cmp_expr(lhsPart, rhsPart, $);
    }
    else {
        return cmp_terms(lhsPart, rhsPart, $);
    }
}

function contains_single_imu(expr: U): boolean {
    if (is_imu(expr)) {
        return true;
    }
    else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_imu) === 1) {
        return true;
    }
    else {
        return false;
    }
}
