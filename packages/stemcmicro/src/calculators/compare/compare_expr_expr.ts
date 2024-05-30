import { is_blade, is_imu, is_num, is_str, is_sym, is_tensor, is_uom } from "math-expression-atoms";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "math-expression-context";
import { car, cdr, is_cons, U } from "math-expression-tree";
import { compare_blade_blade } from "../../operators/blade/blade_extension";
import { strcmp } from "../../operators/str/str_extension";
import { compare_num_num } from "./compare_num_num";
import { compare_sym_sym } from "./compare_sym_sym";
import { compare_tensors } from "./compare_tensors";

/**
 * NIL, Num, Str, Sym, Tensor, Cons, Blade, Imu, Hyp, Uom
 */
export function compare_expr_expr(lhs: U, rhs: U): Sign {
    if (lhs === rhs) {
        return SIGN_EQ;
    }

    if (lhs.isnil && rhs.isnil) {
        return SIGN_EQ;
    }

    if (lhs.isnil) {
        return SIGN_LT;
    }

    if (rhs.isnil) {
        return SIGN_GT;
    }

    if (is_num(lhs) && is_num(rhs)) {
        return compare_num_num(lhs, rhs);
    }

    if (is_num(lhs)) {
        return SIGN_LT;
    }

    if (is_num(rhs)) {
        return SIGN_GT;
    }

    // Under addition, or multiplication, we shouldn't get here.
    // Especially under addition where the addition (+) operator is usually taken to mean string concatenation.
    if (is_str(lhs) && is_str(rhs)) {
        return strcmp(lhs.str, rhs.str);
    }

    if (is_str(lhs)) {
        return SIGN_LT;
    }

    if (is_str(rhs)) {
        return SIGN_GT;
    }

    if (is_sym(lhs) && is_sym(rhs)) {
        return compare_sym_sym(lhs, rhs);
    }

    if (is_sym(lhs)) {
        return SIGN_LT;
    }

    if (is_sym(rhs)) {
        return SIGN_GT;
    }

    if (is_tensor(lhs) && is_tensor(rhs)) {
        return compare_tensors(lhs, rhs);
    }

    if (is_tensor(lhs)) {
        return SIGN_LT;
    }

    if (is_tensor(rhs)) {
        return SIGN_GT;
    }

    if (is_uom(lhs) && is_uom(rhs)) {
        return SIGN_EQ;
    }

    if (is_uom(lhs)) {
        return SIGN_GT;
    }

    if (is_uom(rhs)) {
        return SIGN_LT;
    }

    if (is_blade(lhs) && is_blade(rhs)) {
        return compare_blade_blade(lhs, rhs);
    }

    if (is_blade(lhs)) {
        return SIGN_GT;
    }

    if (is_blade(rhs)) {
        return SIGN_LT;
    }

    if (is_imu(lhs) && is_imu(rhs)) {
        return SIGN_EQ;
    }

    if (is_imu(lhs)) {
        return SIGN_GT;
    }

    if (is_imu(rhs)) {
        return SIGN_LT;
    }

    // recursion here
    while (is_cons(lhs) && is_cons(rhs)) {
        const n = compare_expr_expr(car(lhs), car(rhs));
        if (n !== SIGN_EQ) {
            return n;
        }
        lhs = cdr(lhs);
        rhs = cdr(rhs);
    }

    if (is_cons(rhs)) {
        return SIGN_LT;
    }

    if (is_cons(lhs)) {
        return SIGN_GT;
    }

    return SIGN_EQ;
}
