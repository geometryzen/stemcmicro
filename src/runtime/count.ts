import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_sym } from "../operators/sym/is_sym";
import { is_tensor } from '../tree/tensor/is_tensor';
import { Sym } from "../tree/sym/Sym";
import { is_cons, U } from '../tree/tree';

const sum = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0);

export function count(p: U): number {
    let n: number;
    if (is_cons(p)) {
        const items = [...p];
        n = sum(items.map(count)) + items.length;
    }
    else {
        n = 1;
    }
    return n;
}

// this probably works out to be
// more general than just counting symbols, it can
// probably count instances of anything you pass as
// first argument but didn't try it.
export function countOccurrencesOfSymbol(needle: Sym, p: U, $: ExtensionEnv) {
    let n = 0;
    if (is_cons(p)) {
        n = sum([...p].map((el) => countOccurrencesOfSymbol(needle, el, $)));
    }
    else if ($.equals(needle, p)) {
        n = 1;
    }

    return n;
}

/**
 * Returns the total number of elements in an expression.
 * This is used to supports symbolsinfo (only).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function count_size(expr: U, $: ExtensionEnv): number {
    // TODO: Generalize by creating Operator.countSize(expr): number;
    if (is_tensor(expr)) {
        let n = 0;
        for (let i = 0; i < expr.nelem; i++) {
            n += count(expr.elem(i));
        }
        return n;
    }
    else if (is_cons(expr)) {
        const items = [...expr];
        return sum(items.map(count)) + items.length;
    }
    else if (is_sym(expr)) {
        return 1;
    }
    else {
        return 1;
    }
}
