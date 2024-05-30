import { create_flt } from "../../tree/flt/Flt";
import { Num } from "../../tree/num/Num";
import { is_rat } from "../../operators/rat/is_rat";

export function multiply_num_num(lhs: Num, rhs: Num): Num {
    if (is_rat(lhs)) {
        if (is_rat(rhs)) {
            return lhs.mul(rhs);
        } else {
            const a = lhs.toNumber();
            const b = rhs.d;
            return create_flt(a * b);
        }
    } else {
        if (is_rat(rhs)) {
            const a = lhs.d;
            const b = rhs.toNumber();
            return create_flt(a * b);
        } else {
            return lhs.mul(rhs);
        }
    }
}
