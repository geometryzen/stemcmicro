import { create_tensor_elements, is_str, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { car, cdr, is_cons, nil, U } from "@stemcmicro/tree";
import { compare_term_term } from "./calculators/compare/compare_term_term";
import { defs } from "./runtime/defs";

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
        } else if (p !== p1) {
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
export function sort_stack(n: number, $: ExprContext) {
    const h = defs.tos - n;
    const subsetOfStack = defs.stack.slice(h, h + n) as U[];
    const compareFn = $.compareFn(native_sym(Native.add));
    subsetOfStack.sort(compareFn);
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
export function sort(arr: U[], $: ExprContext): void {
    arr.sort(function (a, b) {
        return compare_term_term(a, b, $);
    });
}
