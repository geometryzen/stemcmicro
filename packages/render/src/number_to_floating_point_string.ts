import { Directive } from "@stemcmicro/directive";
import { PrintConfig } from "./print";
import { PrintMode } from "./PrintMode";

export function number_to_floating_point_string(d: number, $: Pick<PrintConfig, "getDirective">): string {
    // console.lg(`number_to_floating_point_string d=${d}`);
    // when generating code, print out
    // the standard JS Number printout
    let str: string;
    if ($.getDirective(Directive.printMode) === PrintMode.EcmaScript || $.getDirective(Directive.renderFloatAsEcmaScript)) {
        return `${d}`;
    }

    // TODO: It would be better if this were a
    if (!$.getDirective(Directive.forceFixedPrintout)) {
        str = "" + d;
        // manipulate the string so that it can be parsed by
        // by ourselves (something like 1.23e-123 wouldn't cut it because
        // that would be parsed as 1.23*e - 123)

        if ($.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            // 1.0\mathrm{e}{-10} looks much better than the plain 1.0e-10
            if (/\d*\.\d*e.*/gm.test(str)) {
                str = str.replace(/e(.*)/gm, "\\mathrm{e}{$1}");
            } else {
                // if there is no dot in the mantissa, add it so we see it's
                // a double and not a perfect number
                // e.g. 1e-10 becomes 1.0\mathrm{e}{-10}
                str = str.replace(/(\d+)e(.*)/gm, "$1.0\\mathrm{e}{$2}");
            }
        } else {
            if (/\d*\.\d*e.*/gm.test(str)) {
                str = str.replace(/e(.*)/gm, "*10^($1)");
            } else {
                // if there is no dot in the mantissa, add it so we see it's
                // a double and not a perfect number
                // e.g. 1e-10 becomes 1.0e-10
                str = str.replace(/(\d+)e(.*)/gm, "$1.0*10^($2)");
            }
        }
    } else {
        const maxFixedPrintoutDigits = $.getDirective(Directive.maxFixedPrintoutDigits);

        str = d.toFixed(maxFixedPrintoutDigits);

        // remove any trailing zeroes after the dot
        // see https://stackoverflow.com/questions/26299160/using-regex-how-do-i-remove-the-trailing-zeros-from-a-decimal-number
        str = str.replace(/(\.\d*?[1-9])0+$/gm, "$1");
        // in case there are only zeroes after the dot, removes the dot too
        str = str.replace(/\.0+$/gm, "");

        // we actually want to give a hint to user that
        // it's a double, so add a trailing ".0" if there
        // is no decimal point
        if (str.indexOf(".") === -1) {
            str += ".0";
        }

        if (parseFloat(str) !== d) {
            str = d.toFixed(maxFixedPrintoutDigits) + "...";
        }
    }

    return str;
}

/*
function shouldForceFixed($: ExtensionEnv): boolean {
    const forceFixedBinding = $.getBinding(FORCE_FIXED_PRINTOUT, nil);
    return is_rat(forceFixedBinding) ? !$.iszero(forceFixedBinding) : false;
}
*/

/*
function ensureTrailingDecimalZero(repr: string): string {
    if (repr.indexOf('.') === -1) {
        return repr + '.0';
    }
    else {
        return repr;
    }
}
*/
