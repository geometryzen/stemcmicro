import { is_num, is_sym } from "math-expression-atoms";
import { is_native, Native } from "math-expression-native";
import { is_cons, U } from "math-expression-tree";
import { cadr } from "../tree/helpers";

export function isnegativeterm(expr: U): boolean {
    if (is_num(expr) && expr.isNegative()) {
        return true;
    }
    else if (is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.multiply)) {
        const leading = cadr(expr);
        return is_num(leading) && leading.isNegative();
    }
    else {
        return false;
    }
}
