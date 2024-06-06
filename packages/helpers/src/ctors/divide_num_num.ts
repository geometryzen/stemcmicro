import { create_flt, Err, is_flt, is_rat, Num } from "@stemcmicro/atoms";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";

export function divide_num_num(lhs: Num, rhs: Num): Num | Err {
    if (is_rat(lhs) && is_rat(rhs)) {
        return lhs.div(rhs);
    }

    if (rhs.isZero()) {
        return diagnostic(Diagnostics.Division_by_zero);
    }

    const a = is_flt(lhs) ? lhs.d : lhs.toNumber();
    const b = is_flt(rhs) ? rhs.d : rhs.toNumber();

    return create_flt(a / b);
}
