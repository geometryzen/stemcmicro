// gives the capability of printing the unsigned
// value. This is handy because printing of the sign
// might be taken care of "upstream"
// e.g. when printing a base elevated to a negative exponent
// prints the inverse of the base powered to the unsigned

import { is_flt, is_rat, Num } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { number_to_floating_point_string } from "./number_to_floating_point_string";
import { PrintConfig } from "./print";
import { PrintMode } from "./PrintMode";

export function print_number(x: Num, signed: boolean, $: PrintConfig): string {
    if (is_rat(x)) {
        let str = "";
        let numerStr = x.a.toString();
        if (!signed) {
            if (numerStr[0] === "-") {
                numerStr = numerStr.substring(1);
            }
        }

        if ($.getDirective(Directive.printMode) === PrintMode.LaTeX && x.isFraction()) {
            numerStr = "\\frac{" + numerStr + "}{";
        }

        str += numerStr;

        if (x.isFraction()) {
            if ($.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                str += "/";
            }
            let denomStr = x.b.toString();
            if ($.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                denomStr += "}";
            }
            str += denomStr;
        }
        return str;
    } else if (is_flt(x)) {
        const s = number_to_floating_point_string(x.d, $);
        if (!signed) {
            if (s[0] === "-") {
                return s.substring(1);
            } else {
                return s;
            }
        } else {
            return s;
        }
    }
    throw new Error(`print_number(p = ${x})`);
}
