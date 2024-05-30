// special multiple of pi?
// returns for the following multiples of pi...
//  -4/2  -3/2  -2/2  -1/2  1/2  2/2  3/2  4/2

import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { multiply } from "./helpers/multiply";
import { length_of_cons_otherwise_zero } from "./length_of_cons_or_zero";
import { nativeInt } from "./nativeInt";
import { is_num } from "./operators/num/is_num";
import { is_pi } from "./operators/pi/is_pi";
import { is_multiply } from "./runtime/helpers";
import { caddr, cadr } from "./tree/helpers";
import { two } from "./tree/rat/Rat";

//  4  1  2  3  1  2  3  4
export function is_multiple_of_pi(p: U, $: ExprContext): number {
    let n = 0;
    if (is_pi(p)) {
        return 2;
    }
    if (!is_multiply(p) || !is_num(cadr(p)) || !is_pi(caddr(p)) || length_of_cons_otherwise_zero(p) !== 3) {
        return 0;
    }
    n = nativeInt(multiply($, cadr(p), two));
    if (isNaN(n)) {
        return 0;
    }
    if (n < 0) {
        n = 4 - (-n % 4);
    } else {
        n = 1 + ((n - 1) % 4);
    }
    return n;
}
