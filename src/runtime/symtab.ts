import { Sym } from "../tree/sym/Sym";
import { is_nil, nil, U } from "../tree/tree";

export interface Props {
    commutative: boolean,
    complex: boolean,
    extended_negative: boolean,
    extended_nonnegative: boolean,
    extended_nonpositive: boolean,
    extended_nonzero: boolean,
    extended_positive: boolean,
    extended_real: boolean,
    finite: boolean,
    hermitian: boolean,
    imaginary: boolean,
    infinite: boolean,
    negative: boolean,
    nonnegative: boolean,
    nonpositive: boolean,
    nonzero: boolean,
    positive: boolean,
    real: boolean,
    zero: boolean
}

const DEFAULT_PROPS: Props = {
    'commutative': true,
    'complex': true,
    'extended_negative': false,
    'extended_nonnegative': true,
    'extended_nonpositive': false,
    'extended_nonzero': true,
    'extended_positive': true,
    'extended_real': true,
    'finite': true,
    'hermitian': true,
    'imaginary': false,
    'infinite': false,
    'negative': false,
    'nonnegative': true,
    'nonpositive': false,
    'nonzero': true,
    'positive': true,
    'real': true,
    'zero': false
};

/**
 * 
 */
export interface SymTab {
    clear(): void;
    getProps(sym: Sym): Props;
    setProps(sym: Sym, props: Partial<Props>): void;
    /**
     * Returns NIL if the symbol is not bound to anything.
     */
    getValue(sym: Sym): U;
    setValue(sym: Sym, value: U): void;
    entries(): { sym: Sym, value: U }[];
    delete(sym: Sym): void;
}

export function createSymTab(): SymTab {
    const props_from_key: Map<string, Props> = new Map();
    const value_from_key: Map<string, U> = new Map();
    const sym_from_key: Map<string, Sym> = new Map();

    const theTab: SymTab = {
        clear(): void {
            value_from_key.clear();
            sym_from_key.clear();
        },
        getProps(sym: Sym): Props {
            const key: string = sym.key();
            const props = props_from_key.get(key);
            if (props) {
                return props;
            }
            else {
                return DEFAULT_PROPS;
            }
        },
        setProps(sym: Sym, props: Props): void {
            const key = sym.key();
            if (props) {
                props_from_key.set(key, props);
                sym_from_key.set(key, sym);
            }
            else {
                props_from_key.delete(key);
            }
        },
        getValue(sym: Sym): U {
            const key: string = sym.key();
            const value = value_from_key.get(key);
            if (value) {
                return value;
            }
            else {
                return nil;
            }
        },
        setValue(sym: Sym, value: U): void {
            const key = sym.key();
            if (is_nil(value)) {
                value_from_key.delete(key);
            }
            else {
                value_from_key.set(key, value);
                sym_from_key.set(key, sym);
            }
        },
        entries(): { sym: Sym, value: U }[] {
            const bs: { sym: Sym, value: U }[] = [];
            value_from_key.forEach(function (value: U, key: string) {
                const sym = sym_from_key.get(key);
                if (sym) {
                    if (is_nil(value)) {
                        // Ignore.
                    }
                    else {
                        bs.push({ sym, value });
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
            props_from_key.delete(key);
            value_from_key.delete(key);
            sym_from_key.delete(key);
        }
    };
    return theTab;
}
