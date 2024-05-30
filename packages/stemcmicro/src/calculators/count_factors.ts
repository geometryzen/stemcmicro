import { is_cons_opr_eq_mul } from "../operators/mul/is_cons_opr_eq_mul";
import { Cons, U } from "../tree/tree";

export function count_factors(expr: Cons, predicate: (factor: U) => boolean): number {
    if (is_cons_opr_eq_mul(expr)) {
        return count_factors_recursive(expr.argList, predicate);
    } else {
        return 0;
    }
}
function count_factors_recursive(argList: Cons, predicate: (factor: U) => boolean): number {
    if (argList.isnil) {
        return 0;
    } else {
        const arg = argList.car;
        if (predicate(arg)) {
            return 1 + count_factors_recursive(argList.argList, predicate);
        } else {
            return count_factors_recursive(argList.argList, predicate);
        }
    }
}
