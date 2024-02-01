import { is_sym } from "math-expression-atoms";
import { is_native, Native } from "math-expression-native";
import { is_cons, U } from "math-expression-tree";
import { caddr, cadr } from "../tree/helpers";
import { isequalq } from "./isequalq";
import { isminusone } from "./isminusone";

export function isimaginaryunit(p: U): boolean {
    return is_cons(p) && is_sym(p.opr) && is_native(p.opr, Native.pow) && isminusone(cadr(p)) && isequalq(caddr(p), 1, 2);
}
