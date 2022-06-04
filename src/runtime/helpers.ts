import { MATH_ABS } from "../operators/abs/MATH_ABS";
import { is_num } from "../operators/num/is_num";
import { is_opr_eq } from "../predicates/is_opr_eq";
import { is_tensor } from "../operators/tensor/is_tensor";
import { Tensor } from "../tree/tensor/Tensor";
import { Num } from "../tree/num/Num";
import { Sym } from "../tree/sym/Sym";
import { Cons, is_cons, U } from "../tree/tree";
import { DOT, INNER, INV, SYMBOL_IDENTITY_MATRIX, TRANSPOSE } from "./constants";
import { MATH_ADD, MATH_FACTORIAL, MATH_MUL, MATH_OUTER, MATH_POW, MATH_SIN } from "./ns_math";

export function is_abs(expr: U): expr is Cons & { __ts_sym: 'MATH_ABS' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_ABS);
}

/**
 * is_cons && is_opr_eq(..., MATH_ADD)
 */
export function is_add(expr: U): expr is Cons & { __ts_sym: 'MATH_ADD' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_ADD);
}

export function is_multiply(expr: U): expr is Cons & { __ts_sym: 'MATH_MUL' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_MUL);
}

export function is_power(expr: U): expr is Cons & { __ts_sym: 'MATH_POW' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_POW);
}

export function is_factorial(expr: U): expr is Cons & { __ts_sym: 'MATH_FACTORIAL' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_FACTORIAL);
}

export function is_outer(expr: U): expr is Cons & { __ts_sym: 'MATH_OUTER' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_OUTER);
}

export function is_inner_or_dot(expr: U): boolean {
    if (is_cons(expr)) {
        if (is_opr_eq(expr, INNER)) {
            return true;
        }
        if (is_opr_eq(expr, DOT)) {
            return true;
        }
        return false;
    }
    else {
        return false;
    }
}

export function is_transpose(expr: U): boolean {
    return is_cons(expr) && is_opr_eq(expr, TRANSPOSE);
}

export function is_inv(expr: Cons): boolean {
    return is_cons(expr) && is_opr_eq(expr, INV);
}

/**
 * WARNING: This function is rather complicated and isn't exactly described by its name.
 */
export function is_num_or_tensor_or_identity_matrix(p: U): p is Num | Sym | Tensor {
    // because of recursion, we consider a scalar to be
    // a tensor, so a numeric scalar will return true
    if (is_num(p) || SYMBOL_IDENTITY_MATRIX.equals(p)) {
        return true;
    }

    if (is_tensor(p)) {
        return p.everyElement(is_num_or_tensor_or_identity_matrix);
    }
    else {
        return false;
    }

}

// TODO this is a bit of a shallow check, we should
// check when we are passed an actual tensor and possibly
// cache the test result.
export function is_identity_matrix(p: U): p is Sym & { identity: true } {
    return SYMBOL_IDENTITY_MATRIX.equals(p);
}

export function is_sin(expr: U): expr is Cons & { __ts_sym: 'MATH_SIN' } {
    return is_cons(expr) && is_opr_eq(expr, MATH_SIN);
}
