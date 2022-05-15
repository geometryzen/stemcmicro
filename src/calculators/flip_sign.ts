import { Sign, SIGN_GT, SIGN_LT } from "../env/ExtensionEnv";


/**
 * Flips the sign. Useful to make it clear what we are doing if we call a binary function and flip the arguments. 
 */
export function flip_sign(sign: Sign): Sign {
    switch (sign) {
        case SIGN_LT: return SIGN_GT;
        case SIGN_GT: return SIGN_LT;
        default: return sign;
    }
}