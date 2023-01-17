import { ExtensionEnv, Sign, SIGN_EQ } from "../../env/ExtensionEnv";
import { Cons } from "../../tree/tree";
import { compare_terms } from "./compare_terms";

export function compare_cons_cons(lhs: Cons, rhs: Cons, $: ExtensionEnv): Sign {
    return compare_cons_cons_args(lhs, rhs, $, 0);
}

export function compare_cons_cons_args(lhs: Cons, rhs: Cons, $: ExtensionEnv, index: number): Sign {
    if (index < lhs.length) {
        // Fall through.
    }
    else {
        return SIGN_EQ;
    }
    if (index < rhs.length) {
        // Fall through.
    }
    else {
        return SIGN_EQ;
    }
    const indexSign = compare_terms(lhs.item(index), rhs.item(index), $);
    switch (indexSign) {
        case SIGN_EQ: {
            return compare_cons_cons_args(lhs, rhs, $, index + 1);
        }
        default: {
            return indexSign;
        }
    }
}