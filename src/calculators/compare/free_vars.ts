import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_add_2_any_any } from "../../operators/add/is_add_2_any_any";
import { is_blade } from "../../operators/blade/BladeExtension";
import { is_mul } from "../../operators/mul/is_mul";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_sym } from "../../operators/sym/is_sym";
import { print_expr } from "../../print";
import { is_rat } from "../../tree/rat/is_rat";
import { is_cons, U } from "../../tree/tree";

export function free_vars(expr: U, $: ExtensionEnv): string[] {
    if (is_sym(expr)) {
        return [expr.key()];
    }
    if (is_rat(expr)) {
        return [];
    }
    if (is_blade(expr)) {
        return [];
    }
    if (is_cons(expr)) {
        if (is_add_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return [...lvars, ...rvars];
        }
        if (is_pow_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return [...lvars, ...rvars];
        }
        if (is_mul_2_any_any(expr)) {
            const lvars = free_vars(expr.lhs, $);
            const rvars = free_vars(expr.rhs, $);
            return [...lvars, ...rvars];
        }
        if (is_mul(expr)) {
            return [];
        }
    }
    throw new Error(`free_vars ${print_expr(expr, $)}`);
    // return [];
}