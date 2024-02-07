import { is_flt } from "math-expression-atoms";
import { car, U } from "math-expression-tree";
import { ADD, MULTIPLY, POWER } from "../runtime/constants";
import { caddr, cadr } from "../tree/helpers";
import { isequalq } from "./isequalq";
import { isminusone } from "./isminusone";
import { lengthf } from "./lengthf";

export function isdoublez(p: U): boolean {
    if (car(p).equals(ADD)) {

        if (lengthf(p) !== 3)
            return false;

        if (!is_flt(cadr(p))) // x
            return false;

        p = caddr(p);
    }

    if (!car(p).equals(MULTIPLY))
        return false;

    if (lengthf(p) !== 3)
        return false;

    if (!is_flt(cadr(p))) // y
        return false;

    p = caddr(p);

    if (!car(p).equals(POWER))
        return false;

    if (!isminusone(cadr(p)))
        return false;

    if (!isequalq(caddr(p), 1, 2))
        return false;

    return true;
}
