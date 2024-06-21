import { Cons, U } from "@stemcmicro/tree";

export function equals_cons_array(expr: Cons, items: U[]): boolean {
    if (expr.isnil) {
        if (items.length === 0) {
            return true;
        } else {
            return false;
        }
    } else {
        if (items.length === 0) {
            return false;
        } else {
            return equals_cons_array_recursive(expr, items, 0);
        }
    }
}

/**
 * Recursive implementation has been designed to not require allocation of new arrays or mutate the original array.
 * However index must range over the valid indices of the array.
 * @param expr
 * @param items
 * @param index
 * @returns
 */
function equals_cons_array_recursive(expr: Cons, items: U[], index: number): boolean {
    const N = items.length;
    const head = expr.head;
    try {
        if (index < N) {
            const item = items[index];
            if (head.equals(item)) {
                const rest = expr.rest;
                try {
                    return equals_cons_array_recursive(rest, items, index + 1);
                } finally {
                    rest.release();
                }
            } else {
                return false;
            }
        } else {
            return expr.isnil;
        }
    } finally {
        head.release();
    }
}
