import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { compare_blade_blade } from "../../operators/blade/blade_extension";
import { is_blade } from "../../operators/blade/is_blade";
import { is_imu } from "../../operators/imu/is_imu";
import { is_mul } from "../../operators/mul/is_mul";
import { is_num } from "../../operators/num/is_num";
import { is_tensor } from "../../operators/tensor/is_tensor";
import { is_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { count_factors } from "../count_factors";
import { canonical_factor_num_rhs } from "../factorize/canonical_factor_num";
import { remove_factors } from "../remove_factors";
import { cmp_expr } from "./cmp_expr";

const not_is_blade = (expr: U) => !is_blade(expr);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function cmp_terms(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    // console.lg("ENTERING", "cmp_terms", "lhs", render_as_sexpr(lhs, $), "rhs", render_as_sexpr(rhs, $));
    // numbers can be combined

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

function contains_single_blade(expr: U): boolean {
    if (is_blade(expr)) {
        return true;
    }
    else if (is_cons(expr) && is_mul(expr) && count_factors(expr, is_blade) === 1) {
        return true;
    }
    else {
        return false;
    }
}

function extract_single_blade(expr: U): Blade {
    if (is_blade(expr)) {
        return expr;
    }
    else if (is_cons(expr) && is_mul(expr) && count_factors(expr, is_blade) === 1) {
        const candidate = remove_factors(expr, not_is_blade);
        if (is_blade(candidate)) {
            return candidate;
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}

function contains_single_imu(expr: U): boolean {
    if (is_imu(expr)) {
        return true;
    }
    else if (is_cons(expr) && is_mul(expr) && count_factors(expr, is_imu) === 1) {
        return true;
    }
    else {
        return false;
    }
}
