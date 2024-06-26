import { is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_atom, is_cons, U } from "@stemcmicro/tree";

const sum = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0);

/**
 * What exactly are we counting here?
 * Compare with the complexity frunction in Eigenmath which is counting atoms.
 * Noe that nil is being counted with a 1 (like an atom).
 */
export function count(p: U): number {
    let n: number;
    if (is_cons(p)) {
        const items = [...p];
        n = sum(items.map(count)) + items.length;
    } else {
        n = 1;
    }
    return n;
}

// this probably works out to be
// more general than just counting symbols, it can
// probably count instances of anything you pass as
// first argument but didn't try it.
export function countOccurrencesOfSymbol(needle: Sym, x: U, $: ExprContext): number {
    if (is_cons(x)) {
        const head = x.head;
        const rest = x.rest;
        try {
            return countOccurrencesOfSymbol(needle, head, $) + countOccurrencesOfSymbol(needle, rest, $);
        } finally {
            head.release();
            rest.release();
        }
    } else if (is_atom(x)) {
        $.handlerFor(x);
        // We could step into the atom if we want to using the handler, but I'm not sure that is the point.
        // This function is only called in simplify_nested_radicals as a measure of complexity so we
        // probably don't need to walk into tensors... except if the tensor is the top level!
        if (is_sym(x)) {
            return needle.equalsSym(x) ? 1 : 0;
        } else {
            return 0;
        }
    } else {
        // x must be nil...
        return 0;
    }
}
