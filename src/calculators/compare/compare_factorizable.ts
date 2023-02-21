import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { compare_blade_blade } from "../../operators/blade/blade_extension";
import { is_blade } from "../../operators/blade/is_blade";
import { BCons } from "../../operators/helpers/BCons";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { factorizeL } from "../factorizeL";
import { compare } from "./compare";

/**
 * Used for comparing expressions that are factorizable (either Multiply or Power).
 */
export function compare_factorizable(lhs: BCons<Sym, U, U>, rhs: BCons<Sym, U, U>): Sign {
    if (is_blade(lhs.rhs) && is_blade(rhs.rhs)) {
        switch (compare_blade_blade(lhs.rhs, rhs.rhs)) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            default: {
                return compare(lhs.lhs, rhs.lhs);
            }
        }
    }
    const [aL, bL, splitL] = factorizeL(lhs);
    const [aR, bR, splitR] = factorizeL(rhs);
    // Important to determine whether factorization occured to prevent infinite loops.
    if (splitL || splitR) {
        switch (compare(aL, aR)) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            default: {
                return compare(bL, bR);
            }
        }
    }
    else {
        return SIGN_EQ;
    }
}