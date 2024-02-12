import { create_int, Sym, Tensor } from 'math-expression-atoms';
import { Cons, items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from './env/ExtensionEnv';
import { inverse } from './helpers/inverse';
import { nativeInt } from './nativeInt';
import { HILBERT } from './runtime/constants';

/**
 * Hilbert matrix
 * 
 * Hij = 1 / (i + j -1)
 * 
 * https://en.wikipedia.org/wiki/Hilbert_matrix
 * 
 * @param N 
 * @param $ 
 * @returns 
 */
export function hilbert(N: U, $: Pick<ExtensionEnv, 'valueOf'>): Cons | Sym | Tensor {
    const n = nativeInt(N);
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
