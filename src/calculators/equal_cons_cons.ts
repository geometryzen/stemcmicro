import { ExtensionEnv } from "../env/ExtensionEnv";
import { Cons, is_cons, U } from "../tree/tree";

export function equal_cons_cons(lhs: Cons, rhs: Cons, $: ExtensionEnv): boolean {
    let p1: U = lhs;
    let p2: U = rhs;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (is_cons(p1) && is_cons(p2)) {
            if ($.equals(p1.car, p2.car)) {
                p1 = p1.cdr;
                p2 = p2.cdr;
                continue;
            }
            else {
                return false;
            }
        }
        if (is_cons(p1)) {
            return false;
        }
        if (is_cons(p2)) {
            return false;
        }
        if ($.equals(p1, p2)) {
            // They are equal if there is nowhere else to go.
            return true;
        }
        else {
            return false;
        }
    }
}
