import { Sym } from 'math-expression-atoms';
import { U } from 'math-expression-tree';
import { SYMBOL_S, SYMBOL_T, SYMBOL_X, SYMBOL_Y, SYMBOL_Z } from './runtime/constants';

/**
 * Guess which symbol to use for derivative, integral, etc.
 */
export function guess(p: U): Sym {
    if (p.contains(SYMBOL_X)) {
        return SYMBOL_X;
    }
    else if (p.contains(SYMBOL_Y)) {
        return SYMBOL_Y;
    }
    else if (p.contains(SYMBOL_Z)) {
        return SYMBOL_Z;
    }
    else if (p.contains(SYMBOL_T)) {
        return SYMBOL_T;
    }
    else if (p.contains(SYMBOL_S)) {
        return SYMBOL_S;
    }
    else {
        return SYMBOL_X;
    }
}
