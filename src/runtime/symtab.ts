import { Sym } from "../tree/sym/Sym";
import { is_nil, nil, U } from "../tree/tree";

/**
 * 
 */
export interface SymTab {
    clear(): void;
    /**
     * Returns NIL if the symbol is not bound to anything.
     */
    get(sym: Sym): U;
    set(sym: Sym, binding: U): void;
    entries(): { sym: Sym, binding: U }[];
    delete(sym: Sym): void;
}

export function createSymTab(): SymTab {
    const bnd_from_key: Map<string, U> = new Map();
    const sym_from_key: Map<string, Sym> = new Map();

    const theTab: SymTab = {
        clear(): void {
            bnd_from_key.clear();
            sym_from_key.clear();
        },
        get(sym: Sym): U {
            const key: string = sym.key();
            const binding = bnd_from_key.get(key);
            if (binding) {
                return binding;
            }
            else {
                return nil;
            }
        },
        set(sym: Sym, binding: U): void {
            const key = sym.key();
            if (is_nil(binding)) {
                this.delete(sym);
            }
            else {
                bnd_from_key.set(key, binding);
                sym_from_key.set(key, sym);
            }
        },
        entries(): { sym: Sym, binding: U }[] {
            const bs: { sym: Sym, binding: U }[] = [];
            bnd_from_key.forEach(function (binding: U, key: string) {
                const sym = sym_from_key.get(key);
                if (sym) {
                    if (is_nil(binding)) {
                        // Ignore.
                    }
                    else {
                        bs.push({ sym, binding });
                    }
                }
                else {
                    throw new Error();
                }
            });
            return bs;
        },
        delete(sym: Sym): void {
            const key = sym.key();
            bnd_from_key.delete(key);
            sym_from_key.delete(key);
        }
    };
    return theTab;
}
