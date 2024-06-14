import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "@stemcmicro/context";

export function compare_string_string(str1: string, str2: string): Sign {
    if (str1 === str2) {
        return SIGN_EQ;
    } else if (str1 > str2) {
        return SIGN_GT;
    } else {
        return SIGN_LT;
    }
}
