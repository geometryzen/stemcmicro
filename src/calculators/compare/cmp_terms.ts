import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_num } from "../../operators/num/is_num";
import { is_tensor } from "../../operators/tensor/is_tensor";
import { is_multiply } from "../../runtime/helpers";
import { car, cdr, is_nil, U } from "../../tree/tree";
import { cmp_expr } from "./cmp_expr";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function cmp_terms(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    // console.lg("cmp_terms", "lhs", render_as_sexpr(lhs, $), "rhs", render_as_sexpr(rhs, $));
    // numbers can be combined

    if (is_num(lhs) && is_num(rhs)) {
        return SIGN_EQ;
    }

    // congruent tensors can be combined

    if (is_tensor(lhs) && is_tensor(rhs)) {
        if (lhs.rank < rhs.rank) {
            return SIGN_LT;
        }
        if (lhs.rank > rhs.rank) {
            return SIGN_GT;
        }
        const rank = lhs.rank;
        for (let i = 0; i < rank; i++) {
            if (lhs.dim(i) < rhs.dim(i)) {
                return SIGN_LT;
            }
            if (lhs.dim(i) > rhs.dim(i)) {
                return SIGN_GT;
            }
        }
        return SIGN_EQ;
    }

    if (is_multiply(lhs)) {
        lhs = cdr(lhs);
        if (is_num(car(lhs))) {
            lhs = cdr(lhs);
            if (is_nil(cdr(lhs))) {
                lhs = car(lhs);
            }
        }
    }

    if (is_multiply(rhs)) {
        rhs = cdr(rhs);
        if (is_num(car(rhs))) {
            rhs = cdr(rhs);
            if (is_nil(cdr(rhs))) {
                rhs = car(rhs);
            }
        }
    }

    return cmp_expr(lhs, rhs, $);
}
