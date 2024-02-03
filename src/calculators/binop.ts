import { ExtensionEnv } from "../env/ExtensionEnv";
import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { items_to_cons, U } from "../tree/tree";

/**
 * Constructs a binary expression and evaluates it.
 * The arguments are not evaluated.
 * @param opr The symbol in the position of the zeroth element of the list. 
 * @param lhs The expression in the first element of the list.
 * @param rhs The expression in the second element of the list.
 */
export function binop(opr: U, lhs: U, rhs: U, $: Pick<ExtensionEnv, 'valueOf'>): U {
    const C = items_to_cons(opr, lhs, rhs);
    const D = $.valueOf(C);
    return D;
}

/**
 * Constructs a binary expression and evaluates it.
 * WARNING: This may be slower than caching the symbol for the operator.
 * The arguments are not evaluated.
 * @param opr The symbol in the position of the zeroth element of the list. 
 * @param lhs The expression in the first element of the list.
 * @param rhs The expression in the second element of the list.
 */
export function native_binop(opr: Native, lhs: U, rhs: U, $: Pick<ExtensionEnv, 'valueOf'>): U {
    return binop(native_sym(opr), lhs, rhs, $);
}
