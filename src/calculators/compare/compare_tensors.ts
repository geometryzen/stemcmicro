import { Tensor } from "math-expression-atoms";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { compare_expr_expr } from "./compare_expr_expr";

/**
 * FIXME: Needs more testing. When does it make sense to reorder tensors?
 */
export function compare_tensors(lhs: Tensor, rhs: Tensor): Sign {
    if (lhs.ndim < rhs.ndim) {
        return SIGN_LT;
    }

    if (lhs.ndim > rhs.ndim) {
        return SIGN_GT;
    }

    const ndim = lhs.ndim;

    for (let i = 0; i < ndim; i++) {
        if (lhs.dim(i) < rhs.dim(i)) {
            return SIGN_LT;
        }
        if (lhs.dim(i) > rhs.dim(i)) {
            return SIGN_GT;
        }
    }

    const nelem = lhs.nelem;

    for (let i = 0; i < nelem; i++) {
        switch (compare_expr_expr(lhs.elem(i), rhs.elem(i))) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            default: {
                continue;
            }
        }
    }

    return SIGN_EQ;
}
