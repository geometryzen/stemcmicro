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
        case Native.clock: return create_sym('clock');
        case Native.condense: return create_sym('condense');
        case Native.conj: return create_sym('conj');
        case Native.cos: return create_sym('cos');
        case Native.divide: return create_sym('/');
        case Native.exp: return create_sym('exp');
        case Native.expand: return create_sym('expand');
        case Native.expsin: return create_sym('expsin');
        case Native.factor: return create_sym('factor');
        case Native.factorial: return create_sym('factorial');
        case Native.float: return create_sym('float');
        case Native.imag: return create_sym('imag');
        case Native.inner: return create_sym('inner');
        case Native.integral: return create_sym('integral');
        case Native.inverse: return create_sym('inv');
        case Native.is_complex: return create_sym('iscomplex');
        case Native.is_real: return create_sym('isreal');
        case Native.is_zero: return create_sym('iszero');
        case Native.lco: return create_sym('<<');
        case Native.log: return create_sym('log');
        case Native.mod: return create_sym('mod');
        case Native.multiply: return create_sym('*');
        case Native.not: return create_sym('not');
        case Native.outer: return create_sym('outer');
        case Native.polar: return create_sym('polar');
        case Native.pow: return create_sym('pow');
        case Native.rationalize: return create_sym('rationalize');
        case Native.real: return create_sym('real');
        case Native.rect: return create_sym('rect');
        case Native.rco: return create_sym('>>');
        case Native.sin: return create_sym('sin');
        case Native.sqrt: return create_sym('sqrt');
        case Native.spread: return create_sym('...');
        case Native.subtract: return create_sym('-');
        case Native.succ: return create_sym('succ');
        case Native.tau: return create_sym('tau');
        case Native.test: return create_sym('test');
        case Native.test_eq: return create_sym('==');
        case Native.test_ge: return create_sym('>=');
        case Native.test_gt: return create_sym('>');
        case Native.test_le: return create_sym('<=');
        case Native.test_lt: return create_sym('<');
        case Native.test_ne: return create_sym('!=');
        default: throw new Error(`${code}`);
    }
}
