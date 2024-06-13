import { is_blade } from "@stemcmicro/atoms";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { compare_blade_blade } from "../../operators/blade/blade_extension";
import { Cons2 } from "../../operators/helpers/Cons2";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { factorizeL } from "../factorizeL";
import { compare_U_U } from "./compare_U_U";

/**
 * FIXME: Needs more testing.
 * Used for comparing expressions that are factorizable (either Multiply or Power).
 */
export function compare_factorizable(lhs: Cons2<Sym, U, U>, rhs: Cons2<Sym, U, U>): Sign {
    // console.lg("compare_factorizable", `${lhs}`, `${rhs}`);
    if (is_blade(lhs.rhs) && is_blade(rhs.rhs)) {
        switch (compare_blade_blade(lhs.rhs, rhs.rhs)) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            default: {
                return compare_U_U(lhs.lhs, rhs.lhs);
            }
        }
    }
    const [aL, bL, splitL] = factorizeL(lhs);
    const [aR, bR, splitR] = factorizeL(rhs);
    // Important to determine whether factorization occured to prevent infinite loops.
    if (splitL || splitR) {
        switch (compare_U_U(aL, aR)) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            default: {
                return compare_U_U(bL, bR);
            }
        }
    } else {
        return SIGN_EQ;
    }
}
