import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";

export function compare_vars_vars(lhs: string[], rhs: string[]): Sign {
    // console.lg(`compare_vars_vars lhs=${lhs} rhs=${rhs}`);
    let gtCount = 0;
    let eqCount = 0;
    let ltCount = 0;
    for (let i = 0; i < lhs.length; i++) {
        for (let j = 0; j < rhs.length; j++) {
            const signum = strcmp(lhs[i], rhs[j]);
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

function strcmp(str1: string, str2: string): 0 | 1 | -1 {
    if (str1 === str2) {
        return 0;
    }
    else if (str1 > str2) {
        return 1;
    }
    else {
        return -1;
    }
}
