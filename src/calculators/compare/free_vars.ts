import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_add_2_any_any } from "../../operators/add/is_add_2_any_any";
import { is_blade } from "../../operators/blade/BladeExtension";
import { is_unaop } from "../../operators/helpers/is_unaop";
import { is_inner_2_any_any } from "../../operators/inner/is_inner_2_any_any";
import { is_mul } from "../../operators/mul/is_mul";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_outer_2_any_any } from "../../operators/outer/is_outer_2_any_any";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_sym } from "../../operators/sym/is_sym";
import { is_imu } from "../../predicates/is_imu";
import { print_expr } from "../../print";
import { is_flt } from "../../tree/flt/is_flt";
import { is_rat } from "../../tree/rat/is_rat";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_uom } from "../../tree/uom/is_uom";

/**
 * Determines the free variables in an expression.
 * This may be used to order expressions canonically.
 * This approach appears to improve reliability.
 * This may be because it is more consistent with the results of matching.
 */
export function free_vars(expr: U, $: ExtensionEnv): string[] {
    // A more accurate approach would be to delegate the task to the appropriate operator.
    // This would properly handle things like derivatives and integrals. 
    if (is_sym(expr)) {
        return [expr.key()];
    }
    if (is_rat(expr)) {
        return [];
    }
    if (is_cons(expr)) {
        if (is_add_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return merge_vars(lvars, rvars);
        }
        if (is_pow_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return merge_vars(lvars, rvars);
        }
        if (is_mul_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return merge_vars(lvars, rvars);
        }
        if (is_inner_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return merge_vars(lvars, rvars);
        }
        if (is_outer_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return merge_vars(lvars, rvars);
        }
        if (is_mul(expr)) {
            // TODO: We can do better than this.
            return [];
        }
        if (is_unaop(expr)) {
            // TODO: We can do better than this.
            return free_vars((<Cons>expr).arg, $);
        }
    }
    if (is_imu(expr)) {
        return [];
    }
    if (is_blade(expr)) {
        return [];
    }
    if (is_uom(expr)) {
        return [];
    }
    if (is_flt(expr)) {
        return [];
    }
    throw new Error(`free_vars ${print_expr(expr, $)}`);
    // return [];
}

function merge_vars(lhs: string[], rhs: string[]): string[] {
    const set: { [key: string]: boolean } = {};
    for (let i = 0; i < lhs.length; i++) {
        set[lhs[i]] = true;
    }
    for (let j = 0; j < rhs.length; j++) {
        set[rhs[j]] = true;
    }
    return Object.keys(set);
}