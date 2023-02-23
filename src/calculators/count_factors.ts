import { is_mul } from "../operators/mul/is_mul";
import { Cons, is_nil, U } from "../tree/tree";

export function count_factors(expr: Cons, predicate: (factor: U) => boolean): number {
    if (is_mul(expr)) {
        return count_factors_recursive(expr.argList, predicate);
    }
    else {
        return 0;
    }
}
function count_factors_recursive(argList: Cons, predicate: (factor: U) => boolean): number {
    if (is_nil(argList)) {
        return 0;
    }
    else {
        const arg = argList.car;
        if (predicate(arg)) {
            return 1 + count_factors_recursive(argList.argList, predicate);
        }
        else {
            return count_factors_recursive(argList.argList, predicate);
        }
    }
}