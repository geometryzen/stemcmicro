import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_pi } from "../../operators/pi/is_pi";
import { Sym } from "../../tree/sym/Sym";

/**
 * The canonical function for comparing symbols.
 * This function ensures that MATH_PI will appear to the left of any other symbol.
 * It takes no account of whether the symbols should be treated as vectors.
 */
export function compare_sym_sym(lhs: Sym, rhs: Sym): Sign {
    if (is_pi(lhs) && is_pi(rhs)) {
        return SIGN_EQ;
    }
    else if (is_pi(lhs)) {
        return SIGN_LT;
    }
    else if (is_pi(rhs)) {
        return SIGN_GT;
    }
    else {
        return lhs.compare(rhs);
    }
}
