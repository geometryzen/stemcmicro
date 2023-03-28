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
        case Native.arccos: return create_sym('arccos');
        case Native.arcsin: return create_sym('arcsin');
        case Native.arctan: return create_sym('arctan');
        case Native.arg: return create_sym('arg');
        case Native.circexp: return create_sym('circexp');
        case Native.clock: return create_sym('clock');
        case Native.complex: return create_sym('complex');
        case Native.component: return create_sym('component');
        case Native.condense: return create_sym('condense');
        case Native.conj: return create_sym('conj');
        case Native.cos: return create_sym('cos');
        case Native.derivative: return create_sym('derivative');
        case Native.divide: return create_sym('/');
        case Native.exp: return create_sym('exp');
        case Native.expand: return create_sym('expand');
        case Native.expsin: return create_sym('expsin');
        case Native.factor: return create_sym('factor');
        case Native.factorial: return create_sym('factorial');
        case Native.filter: return create_sym('filter');
        case Native.float: return create_sym('float');
        case Native.function: return create_sym('function');
        case Native.gcd: return create_sym('gcd');
        case Native.im: return create_sym('im');
        case Native.infinitesimal: return create_sym('infinitesimal');
        case Native.inner: return create_sym('inner');
        case Native.integral: return create_sym('integral');
        case Native.inverse: return create_sym('inv');
        case Native.iscomplex: return create_sym('iscomplex');
        case Native.isimag: return create_sym('isimag');
        case Native.isinfinite: return create_sym('isinfinite');
        case Native.isinfinitesimal: return create_sym('isinfinitesimal');
        case Native.isnegative: return create_sym('isnegative');
        case Native.ispositive: return create_sym('ispositive');
        case Native.isreal: return create_sym('isreal');
        case Native.iszero: return create_sym('iszero');
        case Native.lco: return create_sym('<<');
        case Native.leading: return create_sym('leading');
        case Native.log: return create_sym('log');
        case Native.lookup: return create_sym('lookup');
        case Native.mod: return create_sym('mod');
        case Native.multiply: return create_sym('*');
        case Native.not: return create_sym('not');
        case Native.outer: return create_sym('outer');
        case Native.polar: return create_sym('polar');
        case Native.pow: return create_sym('pow');
        case Native.pred: return create_sym('pred');
        case Native.prime: return create_sym('prime');
        case Native.rationalize: return create_sym('rationalize');
        case Native.re: return create_sym('re');
        case Native.rect: return create_sym('rect');
        case Native.rco: return create_sym('>>');
        case Native.simplify: return create_sym('simplify');
        case Native.sin: return create_sym('sin');
        case Native.sqrt: return create_sym('sqrt');
        case Native.spread: return create_sym('...');
        case Native.st: return create_sym('st');
        case Native.subst: return create_sym('subst');
        case Native.subtract: return create_sym('-');
        case Native.succ: return create_sym('succ');
        case Native.symbol: return create_sym('symbol');
        case Native.tau: return create_sym('tau');
        case Native.taylor: return create_sym('taylor');
        case Native.test: return create_sym('test');
        case Native.testeq: return create_sym('==');
        case Native.testge: return create_sym('>=');
        case Native.testgt: return create_sym('>');
        case Native.testle: return create_sym('<=');
        case Native.testlt: return create_sym('<');
        case Native.testne: return create_sym('!=');
        default: throw new Error(`${code}`);
    }
}
