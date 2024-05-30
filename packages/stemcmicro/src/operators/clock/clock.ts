import { negOne } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { Directive } from "../../env/ExtensionEnv";
import { abs } from "../../helpers/abs";
import { arg } from "../../helpers/arg";
import { divide } from "../../helpers/divide";
import { multiply } from "../../helpers/multiply";
import { power } from "../../helpers/power";
import { DynamicConstants } from "../../runtime/defs";

/*
 Convert complex z to clock form

  Input:    push  z

  Output:    Result on stack

  clock(z) = abs(z) * (-1) ^ (arg(z) / pi)

  For example, clock(exp(i * pi/3)) gives the result (-1)^(1/3)
*/

// P.S. I couldn't find independent definition/aknowledgment
// of the naming "clock form" anywhere on the web, seems like a
// naming specific to eigenmath.
// Clock form is another way to express a complex number, and
// it has three advantages
//   1) it's uniform with how for example
//      i is expressed i.e. (-1)^(1/2)
//   2) it's very compact
//   3) it's a straighforward notation for roots of 1 and -1
/**
 * z => abs(z) * (-1) ^ (arg(z) / pi)
 * @param z
 * @param $
 * @returns
 */
export function clock(z: U, $: ExprContext): U {
    $.pushDirective(Directive.complexAsClock, 1);
    try {
        // console.lg();
        // console.lg(`clockform z=${print_expr(z, $)}`);
        // pushing the expression (-1)^... but note
        // that we can't use "power", as "power" evaluates
        // clock forms into rectangular form (see "-1 ^ rational"
        // section in power)
        const arg_z = arg(z, $);
        // console.lg(`arg_z=${print_expr(arg_z, $)}`);
        const pi = DynamicConstants.PI($);
        // console.lg(`pi=${print_expr(pi, $)}`);
        const direction = power($, negOne, divide(arg_z, pi, $));
        // console.lg(`direction=${print_expr(direction, $)}`);
        const magnitude = abs(z, $);
        // console.lg(`magnitude=${print_expr(magnitude, $)}`);
        const clock_z = multiply($, magnitude, direction);
        // console.lg(`clock_z  =${print_expr(clock_z, $)}`);
        return clock_z;
    } finally {
        $.popDirective();
    }
}
