import { is_flt, is_num, is_rat, is_uom } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { is_atom, U } from "@stemcmicro/tree";
import { divide_num_num } from "./divide_num_num";
import { float } from "./float";
import { inverse } from "./inverse";
import { multiply } from "./multiply";

export function divide(lhs: U, rhs: U, $: Pick<ExprContext, "getDirective" | "valueOf">): U {
    const debug = $.getDirective(Directive.traceLevel) > 0;
    if (is_rat(rhs) && rhs.isOne()) {
        return lhs;
    }
    if (is_flt(rhs) && rhs.isOne()) {
        return float(lhs, $);
    }
    if (is_uom(rhs) && rhs.isOne()) {
        // We could have dimensionless units here such as radians.
        return multiply($, lhs, rhs.inv());
    }
    // console.lg("divide", `${lhs}`, `${rhs}`);
    if (is_atom(lhs) && is_atom(rhs)) {
        // console.lg("divide atom atom", `${lhs}: ${lhs.type}`, `${rhs}: ${rhs.type}`);
    }
    if (is_num(lhs) && is_num(rhs)) {
        return divide_num_num(lhs, rhs);
    } else {
        const inverse_rhs = inverse(rhs, $);
        try {
            const retval = multiply($, lhs, inverse_rhs);
            if (debug) {
                // console.lg("divide", "lhs", `${lhs}`, "rhs", `${rhs}`, "retval", `${retval}`)
            }
            return retval;
        } finally {
            inverse_rhs.release();
        }
    }
}
