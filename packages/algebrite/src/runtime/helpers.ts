import { is_num, is_sym, is_tensor, Num, Sym, Tensor } from "@stemcmicro/atoms";
import { is_cons_opr_eq_add, is_cons_opr_eq_sym } from "@stemcmicro/helpers";
import { is_native, Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons0, Cons2, is_cons, U } from "@stemcmicro/tree";
import { SYMBOL_IDENTITY_MATRIX, TRANSPOSE } from "./constants";
import { MATH_FACTORIAL, MATH_LCO, MATH_MUL, MATH_RCO, MATH_SIN } from "./ns_math";

export const ABS = native_sym(Native.abs);

export function is_abs(expr: U): expr is Cons & { __ts_sym: "math.abs" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, ABS);
}

/**
 * is_cons && is_opr_eq(..., MATH_ADD)
 */
export function is_add(expr: U): expr is Cons & { __ts_sym: "+" } {
    return is_cons(expr) && is_cons_opr_eq_add(expr);
}

export function is_exp(expr: U): expr is Cons2<Sym, U, U> & { __ts_sym: "MATH_EXP" } {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.exp);
}

export function is_multiply(expr: U): expr is Cons0<Sym> & { __ts_sym: "MATH_MUL" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, MATH_MUL);
}

export function is_power(expr: U): expr is Cons2<Sym, U, U> & { __ts_sym: "MATH_POW" } {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.pow);
}

export function is_factorial(expr: U): expr is Cons & { __ts_sym: "MATH_FACTORIAL" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, MATH_FACTORIAL);
}

export function is_lco(expr: U): expr is Cons & { __ts_sym: "MATH_LCO" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, MATH_LCO);
}

export function is_rco(expr: U): expr is Cons & { __ts_sym: "MATH_RCO" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, MATH_RCO);
}

export function is_transpose(expr: U): boolean {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, TRANSPOSE);
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
    } else {
        return false;
    }
}

// TODO this is a bit of a shallow check, we should
// check when we are passed an actual tensor and possibly
// cache the test result.
export function is_identity_matrix(p: U): p is Sym & { identity: true } {
    return SYMBOL_IDENTITY_MATRIX.equals(p);
}

export function is_sin(expr: U): expr is Cons & { __ts_sym: "MATH_SIN" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, MATH_SIN);
}
