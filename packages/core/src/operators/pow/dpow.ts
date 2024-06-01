import { create_flt, imu } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { U } from "@stemcmicro/tree";
import { add } from "../../helpers/add";
import { multiply } from "../../helpers/multiply";

// power function for double precision floating point

export function dpow(base: number, expo: number, $: Pick<ExprContext, "valueOf">): U {
    if (base === 0.0 && expo < 0.0) {
        return diagnostic(Diagnostics.Division_by_zero);
    }

    // nonnegative base or integer power?
    if (base >= 0.0 || expo % 1.0 === 0.0) {
        return create_flt(Math.pow(base, expo));
    }

    const result = Math.pow(Math.abs(base), expo);

    const theta = Math.PI * expo;

    let a = 0.0;
    let b = 0.0;
    // this ensures the real part is 0.0 instead of a tiny fraction
    if (expo % 0.5 === 0.0) {
        a = 0.0;
        b = Math.sin(theta);
    } else {
        a = Math.cos(theta);
        b = Math.sin(theta);
    }

    return add($, create_flt(a * result), multiply($, create_flt(b * result), imu));
}
