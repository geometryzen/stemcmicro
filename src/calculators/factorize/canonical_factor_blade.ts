import { is_blade } from "../../operators/blade/is_blade";
import { is_mul } from "../../operators/mul/is_mul";
import { one, Rat } from "../../tree/rat/Rat";
import { is_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { canonicalize_mul } from "../canonicalize/canonicalize_mul";
/*
export function canonical_factor_blade_lhs(expr: U): U {
    if (is_blade(expr)) {
        return one;
    }
    else if (is_cons(expr) && is_mul(expr)) {
        expr = canonicalize_mul(expr);
        if (is_cons(expr)) {
            const L0 = expr;
            const factors = L0.tail().reverse();
            if (is_blade(factors[0])) {
                factors.splice(0, 1);
                factors.reverse();
                return items_to_cons(expr.opr, ...factors);
            }
            else {
                return expr;
            }
        }
        else {
            return canonical_factor_blade_rhs(expr);
        }
    }
    else {
        return expr;
    }
}
*/

export function canonical_factor_blade_rhs(expr: U): Rat | Blade {
    if (is_blade(expr)) {
        return expr;
    }
    else if (is_cons(expr) && is_mul(expr)) {
        expr = canonicalize_mul(expr);
        if (is_cons(expr)) {
            const L0 = expr;
            const factors = L0.tail().reverse();
            if (is_blade(factors[0])) {
                return factors[0];
            }
            else {
                return one;
            }
        }
        else {
            return canonical_factor_blade_rhs(expr);
        }
    }
    else {
        return one;
    }
}