import { is_num, is_sym } from "math-expression-atoms";
import { is_native, Native } from "math-expression-native";
import { is_cons, U } from "math-expression-tree";
import { cadr } from "../tree/helpers";

export function isnegativeterm(p: U): boolean {
    if (is_num(p) && p.isNegative()) {
        return true;
    }
    else if (is_cons(p) && is_sym(p.opr) && is_native(p.opr, Native.multiply)) {
        const leading = cadr(p);
        return is_num(leading) && leading.isNegative();
    }
    else {
        return false;
    }
}
