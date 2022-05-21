import { ExtensionEnv } from "../../../env/ExtensionEnv";
import { logarithm } from "../../../log";
import { caddr, cadr } from "../../../tree/helpers";
import { Cons, U } from "../../../tree/tree";
import { derivative_wrt } from "../derivative_wrt";
//-----------------------------------------------------------------------------
//
//       v
//  y = u
//
//  log y = v log u
//
//  1 dy   v du           dv
//  - -- = - -- + (log u) --
//  y dx   u dx           dx
//
//  dy    v  v du           dv
//  -- = u  (- -- + (log u) --)
//  dx       u dx           dx
//
//-----------------------------------------------------------------------------
export function dpower(p1: Cons, p2: U, $: ExtensionEnv): U {
    // v/u
    const arg1 = $.divide(caddr(p1), cadr(p1));

    // du/dx
    const deriv_1 = derivative_wrt(cadr(p1), p2, $);

    // log u
    const log_1 = logarithm(cadr(p1), $);

    // dv/dx
    const deriv_2 = derivative_wrt(caddr(p1), p2, $);

    // u^v
    return $.multiply($.add($.multiply(arg1, deriv_1), $.multiply(log_1, deriv_2)), p1);
}
