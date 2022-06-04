import { Sym } from "../tree/sym/Sym";
import { nil, U } from "../tree/tree";

/**
 * Size of the symbol table.
 * We fix the size and grumble if the user tries to define too many symbols.
 */
const NSYM = 1000;


export interface Binding {
    sym: Sym;
    binding: U;
}

// The following diagram shows how entries are made into the symbol table
//
//   time --->
//
//   0111111111111111111111111111123333333333333333333455555555555555555
//   |<------- keywords --------->|                   |                |
//   |                            |<---- special ---->|<---- user ---->|
//   |                            |<------------- bindings ----------->|
//
//   0 - reset
//   1 - defineSym
//   2 - beginSpecial
//   3 - defineSym
//   4 - endSpecial
//   5 - defineSym and defineKey
//
// At one time, NIL formed a boundary between keywords and bindings but now this is done explicitly
// using the beginSpecial method.

/**
 * 
 */
export interface SymTab {
    clearBindings(): void;
    clearRenamed(): void;
    /**
     * Records a user-defined symbol in the symbol table.
     * This function is idempotent. If the symbol has already been defined, the original symbol is returned. No harm done.
     * @param key The universal key for the symbol. TODO: Does this show that the scanner may need to translate?
     */
    defineKey(key: Sym): Sym;
    beginSpecial(): void;
    endSpecial(): void;
    /**
     * Returns NIL if the symbol is not bound to anything.
     * TODO: NIL is actually the empty list, which is itself something.
     * Would it make more sense to have some other value to indicate undefined?
     */
    getBinding(sym: Sym): U;
    setBinding(sym: Sym, binding: U): void;
    getBindings(): { sym: Sym, binding: U | undefined }[];
    remove(sym: Sym): void;
    reset(): void;
}

export function createSymTab(): SymTab {
    let begin_bindings_index: number | undefined;


    // TODO: replace these three arrays with a single array of some structure.
    const syms: (Sym | undefined)[] = [];
    const bnds: (U | undefined)[] = [];
    const idxs: { [key: string]: number } = {};
    /**
     * Indicates whether an index in the binding table can be reclaimed.
     */
    const recs: boolean[] = [];

    const theTab: SymTab = {
        clearBindings(): void {
            // console.lg(`SymTab.clearBindings()`);
            if (typeof begin_bindings_index === 'number') {
                syms.length = begin_bindings_index;
                bnds.length = begin_bindings_index;
                recs.length = begin_bindings_index;
            }
        },
        clearRenamed(): void {
            // console.lg(`SymTab.clearRenamed()`);
            for (let i = 0; i < syms.length; i++) {
                const sym = syms[i];
                if (sym) {
                    if (sym.ln.indexOf('AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE') !== -1) {
                        syms[i] = void 0;
                        bnds[i] = void 0;
                        recs[i] = true;
                    }
                }
            }
        },
        defineKey(key: Sym): Sym {
            for (let idx = 0; idx < NSYM; idx++) {
                const sym = syms[idx];
                if (typeof sym !== 'undefined') {
                    if (key.equals(sym)) {
                        return sym;
                    }
                }
            }
            for (let idx = 0; idx < NSYM; idx++) {
                if (typeof syms[idx] === 'undefined') {
                    const sym = key;
                    syms[idx] = sym;
                    bnds[idx] = nil;
                    recs[idx] = false;
                    idxs[sym.key()] = idx;
                    return sym;
                }
            }
            throw new Error(`symbol table overflow in symtab_define_key(key = ${JSON.stringify(key)})`);
        },
        beginSpecial(): void {
            begin_bindings_index = syms.length;
        },
        endSpecial(): void {
            // Do nothing.
        },
        getBinding(sym: Sym): U {
            const i = idxs[sym.key()];
            if (typeof i === 'number') {
                if (i >= 0 && i < bnds.length) {
                    const binding = bnds[i];
                    if (typeof binding === 'undefined') {
                        throw new Error(`binding(${sym}) is undefined.`);
                    }
                    return binding;
                }
                else {
                    return nil;
                }
            }
            else {
                return nil;
            }
        },
        setBinding(sym: Sym, binding: U): void {
            // console.lg(`SymTab.setBinding ${sym} ${binding}`);
            const i = idxs[sym.key()];
            if (typeof i === 'number') {
                // TODO: If the binding is a Sym, we should reference count it.
                bnds[i] = binding;
                recs[i] = false;
            }
            else {
                // The symbol must be in the cache because it exists.
                // It's just not an entry in the symbol table.
                theTab.setBinding(theTab.defineKey(sym), binding);
            }
        },
        getBindings(): { sym: Sym, binding: U | undefined }[] {
            const bs: { sym: Sym, binding: U | undefined }[] = [];
            if (typeof begin_bindings_index === 'number') {
                for (let i = begin_bindings_index; i < syms.length; i++) {
                    const sym = syms[i];
                    if (sym) {
                        bs.push({ sym, binding: bnds[i] });
                    }
                }
            }
            return bs;
        },
        remove(sym: Sym): void {
            // console.lg('remove_variable_from_symbol_table()');
            const i = idxs[sym.key()];
            if (typeof i === 'number') {
                if (syms[i]) {
                    syms[i] = void 0;
                    bnds[i] = void 0;
                    recs[i] = true;
                }
            }
        },
        reset(): void {
            begin_bindings_index = void 0;
            syms.length = 0;
            bnds.length = 0;
            recs.length = 0;
        }
    };
    return theTab;
}
