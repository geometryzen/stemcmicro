import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { Tensor } from "../../tree/tensor/Tensor";
import { cmp_expr } from "./cmp_expr";

export function compare_tensors(p1: Tensor, p2: Tensor, $: ExtensionEnv): Sign {
    if (p1.rank < p2.rank) {
        return SIGN_LT;
    }

    if (p1.rank > p2.rank) {
        return SIGN_GT;
    }

    const rank = p1.rank;

    for (let i = 0; i < rank; i++) {
        if (p1.dim(i) < p2.dim(i)) {
            return SIGN_LT;
        }
        if (p1.dim(i) > p2.dim(i)) {
            return SIGN_GT;
        }
    }

    const nelem = p1.nelem;

    for (let i = 0; i < nelem; i++) {
        switch (cmp_expr(p1.elem(i), p2.elem(i), $)) {
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
