import { create_sym, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

const SYMBOL_S = create_sym("s");
const SYMBOL_T = create_sym("t");
const SYMBOL_X = create_sym("x");
const SYMBOL_Y = create_sym("y");
const SYMBOL_Z = create_sym("z");

/**
 * Guess which symbol to use for derivative, integral, etc.
 */
export function guess(p: U): Sym {
    if (p.contains(SYMBOL_X)) {
        return SYMBOL_X;
    } else if (p.contains(SYMBOL_Y)) {
        return SYMBOL_Y;
    } else if (p.contains(SYMBOL_Z)) {
        return SYMBOL_Z;
    } else if (p.contains(SYMBOL_T)) {
        return SYMBOL_T;
    } else if (p.contains(SYMBOL_S)) {
        return SYMBOL_S;
    } else {
        return SYMBOL_X;
    }
}
