import { Sym } from "@stemcmicro/atoms";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";

const PI = native_sym(Native.PI);

/**
 * The canonical function for comparing symbols.
 * This function ensures that MATH_PI will appear to the left of any other symbol.
 * It takes no account of whether the symbols should be treated as vectors.
 */
export function compare_sym_sym(lhs: Sym, rhs: Sym): Sign {
    // console.lg("compare_sym_sym", `${lhs}`, `${rhs}`);
    if (lhs.equalsSym(rhs)) {
        return SIGN_EQ;
    } else if (PI.equalsSym(lhs)) {
        return SIGN_LT;
    } else if (PI.equalsSym(rhs)) {
        return SIGN_GT;
    } else {
        return lhs.compare(rhs);
    }
}
