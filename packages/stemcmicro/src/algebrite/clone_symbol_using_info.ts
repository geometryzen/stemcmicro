import { Sym } from "../tree/sym/Sym";

/**
 * Creates a clone of the first symbol using the scanner information from the second symbol.
 * @param sym The symbol to be cloned.
 * @param info The symbol providing the scanner information.
 */
export function clone_symbol_using_info(sym: Sym, info: Sym) {
    return sym.clone(info.pos, info.end);
}
