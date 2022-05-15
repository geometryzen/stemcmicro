import { Sign, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { MATH_PI } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";

/**
 * The canonical function for comparing symbols.
 * This function ensures that MATH_PI will appear to the left of any other symbol.
 * It takes no account of whether the symbols should be treated as vectors.
 */
export function compare_sym_sym(lhs: Sym, rhs: Sym): Sign {
    if (MATH_PI.equalsSym(lhs)) {
        return SIGN_LT;
    }
    if (MATH_PI.equalsSym(rhs)) {
        return SIGN_GT;
    }
    return lhs.compare(rhs);
}
