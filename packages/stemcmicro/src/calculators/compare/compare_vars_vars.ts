import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { compare_sym_sym } from "./compare_sym_sym";

/**
 * FIXME: Needs more testing.
 */
export function compare_vars_vars(lhs: Sym[], rhs: Sym[]): Sign {
    // console.lg(`compare_vars_vars lhs=${JSON.stringify(lhs)} rhs=${JSON.stringify(rhs)}`);
    let gtCount = 0;
    let eqCount = 0;
    let ltCount = 0;
    for (let i = 0; i < lhs.length; i++) {
        for (let j = 0; j < rhs.length; j++) {
            const signum = compare_sym_sym(lhs[i], rhs[j]);
            switch (signum) {
                case SIGN_GT: {
                    gtCount++;
                    break;
                }
                case SIGN_EQ: {
                    eqCount++;
                    break;
                }
                case SIGN_LT: {
                    ltCount++;
                    break;
                }
            }
        }
    }
    if (eqCount > 0) {
        return SIGN_EQ;
    }
    if (gtCount > 0) {
        if (ltCount > 0) {
            return SIGN_EQ;
        }
        return SIGN_GT;
    }
    if (ltCount > 0) {
        if (gtCount > 0) {
            return SIGN_EQ;
        }
        return SIGN_LT;
    }
    return SIGN_EQ;
}
