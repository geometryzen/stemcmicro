import { is_flt } from "math-expression-atoms";
import { car, U } from "math-expression-tree";
import { ADD, MULTIPLY, POWER } from "../runtime/constants";
import { caddr, cadr } from "../tree/helpers";
import { isequalq } from "./isequalq";
import { isminusone } from "./isminusone";
import { lengthf } from "./lengthf";

export function isdoublez(expr: U): boolean {
    if (car(expr).equals(ADD)) {
        if (lengthf(expr) !== 3) return false;

        if (!is_flt(cadr(expr)))
            // x
            return false;

        expr = caddr(expr);
    }

    if (!car(expr).equals(MULTIPLY)) return false;

    if (lengthf(expr) !== 3) return false;

    if (!is_flt(cadr(expr)))
        // y
        return false;

    expr = caddr(expr);

    if (!car(expr).equals(POWER)) return false;

    if (!isminusone(cadr(expr))) return false;

    if (!isequalq(caddr(expr), 1, 2)) return false;

    return true;
}
