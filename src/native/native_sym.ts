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
        case Native.E: return create_sym('math.e');
        case Native.IMU: return create_sym('unit-imaginary-number');
        case Native.MASH: return create_sym('math.MASH');
        case Native.NIL: return create_sym('nil');
        case Native.PI: return create_sym('math.PI');
        // Functions (lower case)...
        case Native.abs: return create_sym('math.abs');
        case Native.add: return create_sym('add');
        case Native.arg: return create_sym('arg');
        case Native.cosine: return create_sym('cos');
        case Native.divide: return create_sym('/');
        case Native.exp: return create_sym('exp');
        case Native.inner: return create_sym('inner');
        case Native.inverse: return create_sym('inv');
        case Native.lco: return create_sym('<<');
        case Native.multiply: return create_sym('*');
        case Native.outer: return create_sym('outer');
        case Native.pow: return create_sym('math.pow');
        case Native.rco: return create_sym('>>');
        case Native.sine: return create_sym('sin');
        case Native.subtract: return create_sym('-');
        case Native.succ: return create_sym('succ');
        case Native.testeq: return create_sym('testeq');
        default: throw new Error(`${code}`);
    }
}
