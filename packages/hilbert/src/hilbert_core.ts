import { create_int, Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { inverse, num_to_number } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";

const HILBERT = native_sym(Native.hilbert);

/**
 * Hilbert matrix
 *
 * Hij = 1 / (i + j -1)
 *
 * https://en.wikipedia.org/wiki/Hilbert_matrix
 */
export function hilbert_core(N: U, $: Pick<ExprContext, "valueOf">): Cons | Tensor {
    const n = num_to_number(N);
    if (n < 0) {
        return items_to_cons(HILBERT, N);
    }
    const dims = [n, n];
    const elems = new Array<U>(n * n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            elems[i * n + j] = inverse(create_int(i + j + 1), $);
        }
    }
    return new Tensor(dims, elems);
}
