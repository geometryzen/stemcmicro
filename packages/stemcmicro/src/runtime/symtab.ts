import { assert_sym } from "../operators/sym/assert_sym";
import { Sym } from "../tree/sym/Sym";
import { is_nil, nil, U } from "../tree/tree";

/**
 * It's possible that we will use a different representation for our knowledge about symbols.
 * The fact that this mirrors the predicates in the higher levels is coincidental.
 * i.e. Don't merge the two.
 */
export interface Props extends Record<string, boolean> {
    antihermitian: boolean;
    algebraic: boolean;
    commutative: boolean;
    complex: boolean;
    extended_negative: boolean;
    extended_nonnegative: boolean;
    extended_nonpositive: boolean;
    extended_nonzero: boolean;
    extended_positive: boolean;
    finite: boolean;
    hermitian: boolean;
    hypercomplex: boolean;
    hyperreal: boolean;
    imaginary: boolean;
    infinite: boolean;
    infinitesimal: boolean;
    integer: boolean;
    irrational: boolean;
    negative: boolean;
    noninteger: boolean;
    nonnegative: boolean;
    nonpositive: boolean;
    nonzero: boolean;
    positive: boolean;
    rational: boolean;
    real: boolean;
    transcendental: boolean;
    zero: boolean;
}

// We assume that unbound symbols are non-zero positive real numbers.
const DEFAULT_PROPS: Props = Object.freeze({
    antihermitian: false,
    algebraic: true,
    commutative: true,
    complex: true,
    extended_negative: false,
    extended_nonnegative: true,
    extended_nonpositive: false,
    extended_nonzero: true,
    extended_positive: true,
    finite: true,
    hermitian: true,
    hypercomplex: true,
    hyperreal: true,
    imaginary: false,
    infinite: false,
    infinitesimal: false,
    integer: false,
    irrational: false,
    negative: false,
    noninteger: false,
    /**
     * This is a fundamental assumption for unbound symbols.
     */
    nonnegative: true,
    nonpositive: false,
    nonzero: true,
    positive: true,
    rational: true,
    /**
     * This is a fundamental assumption for unbound symbols.
     */
    real: true,
    transcendental: false,
    zero: false
});

/**
 *
 */
export interface SymTab {
    clear(): void;
    getProps(sym: Sym): Props;
    setProps(sym: Sym, overrides: Partial<Props>): void;
    hasBinding(opr: Sym): boolean;
    getBinding(opr: Sym): U;
    setBinding(opr: Sym, bindingvalue: U): void;
    hasUserFunction(sym: Sym): boolean;
    getUserFunction(sym: Sym): U;
    setUserFunction(sym: Sym, usrfunc: U): void;
    entries(): { sym: Sym; value: U }[];
    delete(sym: Sym): void;
}

export function createSymTab(): SymTab {
    const props_from_key: Map<string, Props> = new Map();
    const binding_from_key: Map<string, U> = new Map();
    const usrfunc_from_key: Map<string, U> = new Map();
    const sym_from_key: Map<string, Sym> = new Map();

    const theTab: SymTab = {
        clear(): void {
            props_from_key.clear();
            binding_from_key.clear();
            usrfunc_from_key.clear();
            sym_from_key.clear();
        },
        getProps(sym: Sym): Props {
            const props = props_from_key.get(sym.key());
            if (props) {
                return props;
            } else {
                return DEFAULT_PROPS;
            }
        },
        setProps(sym: Sym, overrides: Partial<Props>): void {
            const key = sym.key();
            if (overrides) {
                const props = Object.freeze(Object.assign({ ...this.getProps(sym) }, implications(overrides)));
                props_from_key.set(key, props);
                sym_from_key.set(key, sym);
            } else {
                props_from_key.delete(key);
            }
        },
        hasBinding(name: Sym) {
            assert_sym(name);
            const exists = binding_from_key.has(name.key());
            // console.lg("SymTab.hasBinding", `${sym}`, " => ", exists);
            return exists;
        },
        getBinding(sym: Sym): U {
            const value = binding_from_key.get(sym.key());
            if (value) {
                return value;
            } else {
                return nil;
            }
        },
        getUserFunction(sym: Sym): U {
            const value = usrfunc_from_key.get(sym.key());
            if (value) {
                return value;
            } else {
                return nil;
            }
        },
        hasUserFunction(sym: Sym): boolean {
            return usrfunc_from_key.has(sym.key());
        },
        setBinding(sym: Sym, value: U): void {
            assert_sym(sym);
            const key = sym.key();
            binding_from_key.set(key, value);
            sym_from_key.set(key, sym);
        },
        setUserFunction(sym: Sym, value: U): void {
            assert_sym(sym);
            const key = sym.key();
            if (is_nil(value)) {
                usrfunc_from_key.delete(key);
            } else {
                usrfunc_from_key.set(key, value);
                sym_from_key.set(key, sym);
            }
        },
        entries(): { sym: Sym; value: U }[] {
            const bs: { sym: Sym; value: U }[] = [];
            binding_from_key.forEach(function (value: U, key: string) {
                const sym = sym_from_key.get(key);
                if (sym) {
                    if (is_nil(value)) {
                        // Ignore.
                    } else {
                        bs.push({ sym, value });
                    }
                } else {
                    throw new Error();
                }
            });
            return bs;
        },
        delete(sym: Sym): void {
            const key = sym.key();
            props_from_key.delete(key);
            binding_from_key.delete(key);
            sym_from_key.delete(key);
        }
    };
    return theTab;
}

/**
 * Returns a copy of the overrides where the implications of the overrides are made explicit.
 *
 * zero => infinitesimal
 * zero => nonzero = false
 *
 * @param overrides
 */
function implications(overrides: Partial<Props>): Partial<Props> {
    const props: Partial<Props> = { ...overrides };
    if (typeof props.infinite === "boolean") {
        if (props.infinite) {
            props.finite = false;
            props.infinitesimal = false;
            props.integer = false;
            props.nonzero = true;
            props.real = false;
            props.zero = false;
        }
    }
    if (typeof props.infinitesimal === "boolean") {
        if (props.infinitesimal) {
            props.finite = true;
            props.infinite = false;
            props.nonzero = true;
            props.real = false;
        }
    }
    if (typeof props.negative === "boolean") {
        props.positive = false;
        props.nonnegative = false;
        props.zero = false;
        props.nonzero = true;
    }
    if (typeof props.zero === "boolean") {
        if (props.zero) {
            props.infinitesimal = true;
            props.integer = true;
            props.nonzero = false;
            props.negative = false;
            props.positive = false;
        }
    }
    return props;
}
