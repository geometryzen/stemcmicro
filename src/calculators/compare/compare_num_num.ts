import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_flt } from "../../operators/flt/FltExtension";
import { is_rat } from "../../operators/rat/RatExtension";
import { Num } from "../../tree/num/Num";

export function compare_num_num(lhs: Num, rhs: Num): Sign {
    if (is_rat(lhs) && is_rat(rhs)) {
        return lhs.compare(rhs);
    }

    const x = is_flt(lhs) ? lhs.toNumber() : lhs.toNumber();
    const y = is_flt(rhs) ? rhs.toNumber() : rhs.toNumber();

    if (x < y) {
        return SIGN_LT;
    }
    if (x > y) {
        return SIGN_GT;
    }
    return SIGN_EQ;
}
