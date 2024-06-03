import { is_blade } from "@stemcmicro/atoms";
import { is_cons_opr_eq_multiply } from "@stemcmicro/predicates";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_add_2_any_any } from "../../operators/add/is_add_2_any_any";
import { is_flt } from "../../operators/flt/is_flt";
import { is_unaop } from "../../operators/helpers/is_unaop";
import { is_imu } from "../../operators/imu/is_imu";
import { is_inner_2_any_any } from "../../operators/inner/is_inner_2_any_any";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_outer_2_any_any } from "../../operators/outer/is_outer_2_any_any";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_rat } from "../../operators/rat/is_rat";
import { is_sym } from "../../operators/sym/is_sym";
import { is_tensor } from "../../operators/tensor/is_tensor";
import { is_uom } from "../../operators/uom/is_uom";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";

/**
 * Determines the free variables in an expression.
 * This may be used to order expressions canonically.
 * This approach appears to improve reliability.
 * This may be because it is more consistent with the results of matching.
 */
export function free_vars(expr: U, $: ExtensionEnv): Sym[] {
    // console.lg(`free_vars(expr=${render_as_sexpr(expr, $)})`);
    // A more accurate approach would be to delegate the task to the appropriate operator.
    // This would properly handle things like derivatives and integrals.
    if (is_sym(expr)) {
        return [expr];
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
        if (is_cons_opr_eq_multiply(expr)) {
            // TODO: We can do better than this.
            return [];
        }
        if (is_unaop(expr)) {
            // TODO: We can do better than this.
            return free_vars((<Cons>expr).arg, $);
        }
        return [];
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
    if (is_tensor(expr)) {
        return [];
    }
    throw new Error(`free_vars ${expr}`);
    // return [];
}

function merge_vars(lhs: Sym[], rhs: Sym[]): Sym[] {
    const set: { [key: string]: Sym } = {};
    for (let i = 0; i < lhs.length; i++) {
        set[lhs[i].key()] = lhs[i];
    }
    for (let j = 0; j < rhs.length; j++) {
        set[rhs[j].key()] = rhs[j];
    }
    const syms: Sym[] = [];
    const keys = Object.keys(set);
    keys.sort();
    for (const key of keys) {
        syms.push(set[key]);
    }
    return syms;
}
