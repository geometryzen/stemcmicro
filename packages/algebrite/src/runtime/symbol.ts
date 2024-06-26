import { is_sym, is_tensor, Sym, Uom } from "@stemcmicro/atoms";
import { car, cdr, is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../env/ExtensionEnv";

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
