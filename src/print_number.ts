// gives the capability of printing the unsigned
// value. This is handy because printing of the sign
// might be taken care of "upstream"
// e.g. when printing a base elevated to a negative exponent
// prints the inverse of the base powered to the unsigned

import { ExtensionEnv } from './env/ExtensionEnv';
import { defs, PRINTMODE_LATEX } from "./runtime/defs";
import { number_to_floating_point_string } from "./runtime/number_to_floating_point_string";
import { is_flt } from "./tree/flt/is_flt";
import { Num } from "./tree/num/Num";
import { is_rat } from "./tree/rat/is_rat";

// exponent.
export function print_number(p: Num, signed: boolean, $: ExtensionEnv): string {

    if (is_rat(p)) {
        let str = '';
        let numerStr = p.a.toString();
        if (!signed) {
            if (numerStr[0] === '-') {
                numerStr = numerStr.substring(1);
            }
        }

        if (defs.printMode === PRINTMODE_LATEX && p.isFraction()) {
            numerStr = '\\frac{' + numerStr + '}{';
        }

        str += numerStr;

        if (p.isFraction()) {
            if (defs.printMode !== PRINTMODE_LATEX) {
                str += '/';
            }
            let denomStr = p.b.toString();
            if (defs.printMode === PRINTMODE_LATEX) {
                denomStr += '}';
            }
            str += denomStr;
        }
        return str;
    }
    else if (is_flt(p)) {
        let str = '';
        let aAsString = number_to_floating_point_string(p.d, $);
        if (!signed) {
            if (aAsString[0] === '-') {
                aAsString = aAsString.substring(1);
            }
        }
        str += aAsString;
        return str;
    }
    throw new Error(`print_number(p = ${p})`);
}
