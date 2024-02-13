import { is_flt, is_rat, is_tensor } from "math-expression-atoms";
import { U } from "math-expression-tree";

export function iszero(expr: U): boolean {

    if (is_rat(expr)) {
        return expr.isZero();
    }

    if (is_flt(expr)) {
        return expr.d === 0;
    }

    if (is_tensor(expr)) {
        const n = expr.nelem;
        for (let i = 0; i < n; i++) {
            if (!iszero(expr.elems[i]))
                return false;
        }
        return true;
    }

    return false;
}
