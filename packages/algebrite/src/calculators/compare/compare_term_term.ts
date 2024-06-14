import { is_blade, is_boo, is_imu, is_num, is_str, is_tensor } from "@stemcmicro/atoms";
import { ExprContext, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "@stemcmicro/context";
import { compare_blade_blade, compare_num_num, contains_single_blade, count_factors, is_cons_opr_eq_multiply } from "@stemcmicro/helpers";
import { is_cons, U } from "@stemcmicro/tree";
import { canonical_factor_num_lhs, canonical_factor_num_rhs } from "../factorize/canonical_factor_num";
import { remove_factors } from "../remove_factors";
import { compare_expr_expr } from "./compare_expr_expr";
import { extract_single_blade } from "./extract_single_blade";

export function compare_term_term(lhs: U, rhs: U, $: ExprContext): Sign {
    const lhsR = canonical_factor_num_rhs(lhs);
    const rhsR = canonical_factor_num_rhs(rhs);

    // Under addition, we don't want strings to be sorted because they don't commute.
    // Perhaps the only thing that doesn't commute under addition?
    if (is_str(lhsR) && is_str(rhsR)) {
        return SIGN_EQ;
    }

    if (is_boo(lhsR) || is_boo(rhsR)) {
        return SIGN_EQ;
    }

    switch (compare_terms_core(lhsR, rhsR, $)) {
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

function compare_terms_core(lhs: U, rhs: U, $: ExprContext): Sign {
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
        } else {
            switch (compare_term_term(bladeL, bladeR, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    return compare_term_term(remove_factors(lhs, is_blade), remove_factors(rhs, is_blade), $);
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
        return compare_term_term(remove_factors(lhs, is_imu), remove_factors(rhs, is_imu), $);
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
        if (lhs.ndim < rhs.ndim) {
            return SIGN_LT;
        }
        if (lhs.ndim > rhs.ndim) {
            return SIGN_GT;
        }
        const ndim = lhs.ndim;
        for (let i = 0; i < ndim; i++) {
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
        return compare_expr_expr(lhsPart, rhsPart);
    } else {
        return compare_term_term(lhsPart, rhsPart, $);
    }
}

function contains_single_imu(expr: U): boolean {
    if (is_imu(expr)) {
        return true;
    } else if (is_cons(expr) && is_cons_opr_eq_multiply(expr) && count_factors(expr, is_imu) === 1) {
        return true;
    } else {
        return false;
    }
}
