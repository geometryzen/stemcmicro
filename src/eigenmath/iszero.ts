import { is_flt, is_rat, is_tensor } from "math-expression-atoms";
import { U } from "math-expression-tree";

export function iszero(p: U): boolean {

    if (is_rat(p))
        return p.isZero();

    if (is_flt(p))
        return p.d === 0;

    if (is_tensor(p)) {
        const n = p.nelem;
        for (let i = 0; i < n; i++) {
            if (!iszero(p.elems[i]))
                return false;
        }
        return true;
    }

    return false;
}
