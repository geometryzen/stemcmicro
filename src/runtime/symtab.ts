import { Sym } from "../tree/sym/Sym";
import { is_nil, nil, U } from "../tree/tree";

/**
 * It's possible that we will use a different representation for our knowledge about symbols.
 * The fact that this mirrors the predicates in the higher levels is coincidental.
 * i.e. Don't merge the two.
 */
export interface Props extends Record<string, boolean> {
    readonly antihermitian: boolean,
    readonly algebraic: boolean;
    readonly commutative: boolean,
    readonly complex: boolean,
    readonly extended_negative: boolean,
    readonly extended_nonnegative: boolean,
    readonly extended_nonpositive: boolean,
    readonly extended_nonzero: boolean,
    readonly extended_positive: boolean,
    readonly extended_real: boolean,
    readonly finite: boolean,
    readonly hermitian: boolean,
    readonly imaginary: boolean,
    readonly infinite: boolean,
    readonly integer: boolean;
    readonly irrational: boolean;
    readonly negative: boolean,
    readonly noninteger: boolean;
    readonly nonnegative: boolean,
    readonly nonpositive: boolean,
    readonly nonzero: boolean,
    readonly positive: boolean,
    readonly rational: boolean,
    readonly real: boolean,
    readonly transcendental: boolean,
    readonly zero: boolean
}

const DEFAULT_PROPS: Props = Object.freeze({
    'antihermitian': false,
    'algebraic': true,
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
    'integer': false,
    'irrational': false,
    'negative': false,
    'noninteger': false,
    'nonnegative': true,
    'nonpositive': false,
    'nonzero': true,
    'positive': true,
    'rational': true,
    'real': true,
    'transcendental': false,
    'zero': false
});

/**
 * 
 */
export interface SymTab {
    clear(): void;
    getProps(sym: Sym | string): Props;
    setProps(sym: Sym, overrides: Partial<Props>): void;
    /**
     * Returns NIL if the symbol is not bound to anything.
     */
    getValue(sym: Sym | string): U;
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
            props_from_key.clear();
            value_from_key.clear();
            sym_from_key.clear();
        },
        getProps(sym: Sym | string): Props {
            if (typeof sym === 'string') {
                const props = props_from_key.get(sym);
                if (props) {
                    return props;
                }
                else {
                    return DEFAULT_PROPS;
                }
            }
            else {
                return this.getProps(sym.key());
            }
        },
        setProps(sym: Sym, overrides: Partial<Props>): void {
            const key = sym.key();
            if (overrides) {
                const props = Object.freeze(Object.assign({ ...this.getProps(sym) }, overrides));
                props_from_key.set(key, props);
                sym_from_key.set(key, sym);
            }
            else {
                props_from_key.delete(key);
            }
        },
        getValue(sym: Sym | string): U {
            if (typeof sym === 'string') {
                const value = value_from_key.get(sym);
                if (value) {
                    return value;
                }
                else {
                    return nil;
                }
            }
            else {
                return this.getValue(sym.key());
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
