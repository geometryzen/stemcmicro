import { ExtensionEnv } from '../env/ExtensionEnv';
import { is_sym } from '../operators/sym/is_sym';
import { is_tensor } from '../operators/tensor/is_tensor';
import { Sym } from '../tree/sym/Sym';
import { car, cdr, is_cons, U } from '../tree/tree';
import { Uom } from '../tree/uom/Uom';

/**
 * TODO: Move this abstraction of Uom to where Uom is defined.
 * SHOULD be create_uom etc.
 */
export function get_uom_name(p: Uom): string {
    // TODO: We have some other formatting options here.
    // toExponential, toFixed, and toPrecision. 
    return p.toString(10, true);
}

// collect all the variables in a tree
export function collectUserSymbols(p: U, accumulator: Sym[], $: ExtensionEnv): void {
    if (accumulator == null) {
        // TODO: Surely this is dead code?
        accumulator = [];
    }
    if (is_sym(p)) {
        if (accumulator.indexOf(p) === -1) {
            accumulator.push(p);
            return;
        }
    }

    // TODO: Make generic for all extensions.
    if (is_tensor(p)) {
        for (let i = 0; i < p.nelem; i++) {
            collectUserSymbols(p.elem(i), accumulator, $);
        }
        return;
    }

    while (is_cons(p)) {
        collectUserSymbols(car(p), accumulator, $);
        p = cdr(p);
    }
}
