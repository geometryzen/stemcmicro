import { create_sym, Sym } from "../tree/sym/Sym";
import { Native } from "./Native";

const cache: Map<Native, Sym> = new Map();

export function native_sym(code: Native): Sym {
    const sym = cache.get(code);
    if (sym) {
        return sym;
    }
    else {
        const s = build_sym(code);
        cache.set(code, s);
        return s;
    }
}

export function build_sym(code: Native): Sym {
    switch (code) {
        // Constants (upper case)...
        case Native.E: return create_sym('E');
        case Native.IMU: return create_sym('IMU');
        case Native.MASH: return create_sym('MASH');
        case Native.NIL: return create_sym('NIL');
        case Native.PI: return create_sym('PI');
        // Functions (lower case)...
        case Native.abs: return create_sym('abs');
        case Native.add: return create_sym('add');
        case Native.arctan: return create_sym('arctan');
        case Native.arg: return create_sym('arg');
        case Native.conj: return create_sym('conj');
        case Native.cos: return create_sym('cos');
        case Native.divide: return create_sym('/');
        case Native.exp: return create_sym('exp');
        case Native.imag: return create_sym('imag');
        case Native.inner: return create_sym('inner');
        case Native.inverse: return create_sym('inv');
        case Native.is_complex: return create_sym('iscomplex');
        case Native.is_real: return create_sym('isreal');
        case Native.lco: return create_sym('<<');
        case Native.log: return create_sym('log');
        case Native.multiply: return create_sym('*');
        case Native.outer: return create_sym('outer');
        case Native.pow: return create_sym('pow');
        case Native.real: return create_sym('real');
        case Native.rect: return create_sym('rect');
        case Native.rco: return create_sym('>>');
        case Native.sin: return create_sym('sin');
        case Native.spread: return create_sym('...');
        case Native.subtract: return create_sym('-');
        case Native.succ: return create_sym('succ');
        case Native.tau: return create_sym('tau');
        case Native.test_eq: return create_sym('==');
        case Native.test_ge: return create_sym('>=');
        case Native.test_gt: return create_sym('>');
        case Native.test_le: return create_sym('<=');
        case Native.test_lt: return create_sym('<');
        case Native.test_ne: return create_sym('!=');
        default: throw new Error(`${code}`);
    }
}
