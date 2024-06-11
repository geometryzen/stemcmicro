import { is_flt } from "@stemcmicro/atoms";
import { is_cons_opr_eq_add, is_cons_opr_eq_multiply, is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { caddr, cadr, is_cons, U } from "@stemcmicro/tree";
import { isequalq } from "./isequalq";
import { isminusone } from "./isminusone";
import { lengthf } from "./lengthf";

export function isdoublez(expr: U): boolean {
    if (is_cons(expr) && is_cons_opr_eq_add(expr)) {
        if (lengthf(expr) !== 3) return false;

        if (!is_flt(cadr(expr)))
            // x
            return false;

        expr = caddr(expr);
    }

    if (is_cons(expr) && is_cons_opr_eq_multiply(expr)) {
        if (lengthf(expr) !== 3) return false;

        if (!is_flt(cadr(expr)))
            // y
            return false;

        expr = caddr(expr);

        if (is_cons(expr) && is_cons_opr_eq_power(expr)) {
            if (!isminusone(cadr(expr))) return false;

            if (!isequalq(caddr(expr), 1, 2)) return false;

            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
