
// n/2 * i * pi ?
// return value:
//  0  no
//  1  1
//  2  -1
//  3  i

import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from "./env/imu";
import { length_of_cons_otherwise_zero } from "./length_of_cons_or_zero";
import { nativeInt } from "./nativeInt";
import { is_num } from "./operators/num/is_num";
import { PI } from "./runtime/constants";
import { is_multiply } from "./runtime/helpers";
import { cadddr, caddr, cadr } from "./tree/helpers";
import { two } from "./tree/rat/Rat";
import { U } from "./tree/tree";

//  4  -i
export function is_quarter_turn(p: U, $: ExtensionEnv): 0 | 1 | 2 | 3 | 4 {
    let minussign = 0;

    if (!is_multiply(p)) {
        return 0;
    }

    if ($.equals(cadr(p), imu)) {
        if (!caddr(p).equals(PI)) {
            return 0;
        }

        if (length_of_cons_otherwise_zero(p) !== 3) {
            return 0;
        }

        return 2;
    }

    if (!is_num(cadr(p))) {
        return 0;
    }

    if (!$.equals(caddr(p), imu)) {
        return 0;
    }

    if (!cadddr(p).equals(PI)) {
        return 0;
    }

    if (length_of_cons_otherwise_zero(p) !== 4) {
        return 0;
    }

    let n = nativeInt($.multiply(cadr(p), two));
    if (isNaN(n)) {
        return 0;
    }

    if (n < 1) {
        minussign = 1;
        n = -n;
    }

    switch (n % 4) {
        case 0:
            n = 1;
            break;
        case 1:
            n = minussign ? 4 : 3;
            break;
        case 2:
            n = 2;
            break;
        case 3:
            n = minussign ? 3 : 4;
    }

    return n as 0 | 1 | 2 | 3 | 4;
}
