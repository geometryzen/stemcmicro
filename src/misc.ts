import { is_str, Tensor, zero } from 'math-expression-atoms';
import { car, cdr, is_cons, nil, U } from 'math-expression-tree';
import { compare_term_term } from './calculators/compare/compare_term_term';
import { ExtensionEnv } from './env/ExtensionEnv';
import { defs } from './runtime/defs';
import { create_tensor_elements } from './tree/tensor/create_tensor_elements';

// both ints
export function zero_matrix(i: number, j: number): Tensor<U> {
    const elems = create_tensor_elements(i * j, zero);
    const dims = [i, j];
    return new Tensor(dims, elems);
}

export function unique(p: U) {
    let p1 = nil;
    const p2 = nil;
    unique_f(p, p1, p2);
    if (nil !== p2) {
        p1 = nil;
    }
    p = p1;
    return p;
}

function unique_f(p: U, p1: U, p2: U) {
    if (is_str(p)) {
        if (p1.isnil) {
            p1 = p;
        }
        else if (p !== p1) {
            p2 = p;
        }
        return;
    }
    while (is_cons(p)) {
        unique_f(car(p), p1, p2);
        if (nil !== p2) {
            return;
        }
        p = cdr(p);
    }
}

// n an integer
/**
 * @deprecated until we decide whether to sort as terms or factors.
 * @param n 
 * @param $ 
 */
export function sort_stack(n: number, $: ExtensionEnv) {
    const h = defs.tos - n;
    const subsetOfStack = defs.stack.slice(h, h + n) as U[];
    subsetOfStack.sort(function (a, b) {
        return compare_term_term(a, b, $);
    });
    defs.stack = defs.stack
        .slice(0, h)
        .concat(subsetOfStack)
        .concat(defs.stack.slice(h + n));
}

/**
 * @deprecated Use a sort where the assumptions are explicit.
 * @param arr 
 * @param $ 
 */
export function sort(arr: U[], $: ExtensionEnv): void {
    arr.sort(function (a, b) {
        return compare_term_term(a, b, $);
    });
}
