import { RBTree } from "generic-rbtree";
import { create_sym, create_sym_ns, Sym } from "@stemcmicro/atoms";
import { Native, NATIVE_MAX, NATIVE_MIN } from "./Native";

export const ns_mathematical_constants = "Math";
export const ns_greek_alphabet = "Greek";

interface Comparator<K> {
    (a: K, b: K): -1 | 1 | 0;
}

function create_sym_ns_id(localName: string, namespace: string, id: number): Sym {
    return create_sym_ns(localName, namespace, void 0, void 0, id);
}

function create_sym_id(localName: string, id: number): Sym {
    return create_sym(localName, void 0, void 0, id);
}

const numberComparator: Comparator<number> = function (x: number, y: number) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
};

const nilValue = create_sym_ns("", "");
/**
 * map from Native to the Sym using RBTree.
 */
const cacheN: RBTree<Native, Sym> = new RBTree<Native, Sym>(NATIVE_MIN - 1, NATIVE_MAX + 1, nilValue, numberComparator);
/**
 * map from the Sym.key() (string) to the Sym.
 */
const cacheS: Map<string, Native> = new Map();

for (let code = NATIVE_MIN; code <= NATIVE_MAX; code++) {
    const sym = build_sym(code);
    if (sym.id === code) {
        cacheN.insert(code, sym);
        cacheS.set(sym.key(), code);
    } else {
        throw new Error(`${code} ${sym.key()}`);
    }
}

/**
 * @returns The `Sym` corresponding to the `Native` `code`.
 */
export function native_sym(code: Native): Sym {
    return cacheN.search(code);
}

/**
 * @returns Determines whether the `sym` is recognized as `Native`.
 */
export function is_native_sym(sym: Sym): boolean {
    return cacheS.has(sym.key());
}

export function code_from_native_sym(sym: Sym): Native | -1 {
    const key = sym.key();
    if (cacheS.has(sym.key())) {
        return cacheS.get(key)!;
    } else {
        return -1;
    }
}

export function is_native(sym: Sym, code: Native): boolean {
    const genuine = cacheN.search(code);
    return genuine.equalsSym(sym);
}

function build_sym(code: Native): Sym {
    switch (code) {
        // Constants (upper case)...
        case Native.E:
            return create_sym_ns_id("e", ns_mathematical_constants, Native.E);
        case Native.IMU:
            return create_sym_id("IMU", Native.IMU);
        case Native.MASH:
            return create_sym_id("MASH", Native.MASH);
        case Native.NIL:
            return create_sym_id("NIL", Native.NIL);
        case Native.greek_uppercase_letter_Pi:
            return create_sym_ns_id("PI", ns_greek_alphabet, Native.greek_uppercase_letter_Pi);
        case Native.PI:
            return create_sym_ns_id("Pi", ns_mathematical_constants, Native.PI);
        case Native.greek_lowercase_letter_Pi:
            return create_sym_ns_id("pi", ns_greek_alphabet, Native.greek_lowercase_letter_Pi);
        // Functions (lower case)...
        case Native.abs:
            return create_sym_id("abs", Native.abs);
        case Native.adj:
            return create_sym_id("adj", Native.adj);
        case Native.add:
            return create_sym_id("+", Native.add);
        case Native.and:
            return create_sym_id("and", Native.and);
        case Native.arccos:
            return create_sym_id("arccos", Native.arccos);
        case Native.arccosh:
            return create_sym_id("arccosh", Native.arccosh);
        case Native.arcsin:
            return create_sym_id("arcsin", Native.arcsin);
        case Native.arcsinh:
            return create_sym_id("arcsinh", Native.arcsinh);
        case Native.arctan:
            return create_sym_id("arctan", Native.arctan);
        case Native.arctanh:
            return create_sym_id("arctanh", Native.arctanh);
        case Native.arg:
            return create_sym_id("arg", Native.arg);
        case Native.assign:
            return create_sym_id("=", Native.assign);
        case Native.atom:
            return create_sym_id("atom", Native.atom);
        case Native.autoexpand:
            return create_sym_id("autoexpand", Native.autoexpand);
        case Native.autofactor:
            return create_sym_id("autofactor", Native.autofactor);
        case Native.bake:
            return create_sym_id("bake", Native.bake);
        case Native.besselj:
            return create_sym_id("besselj", Native.besselj);
        case Native.bessely:
            return create_sym_id("bessely", Native.bessely);
        case Native.binding:
            return create_sym_id("binding", Native.binding);
        case Native.binomial:
            return create_sym_id("binomial", Native.binomial);
        case Native.ceiling:
            return create_sym_id("ceiling", Native.ceiling);
        case Native.check:
            return create_sym_id("check", Native.check);
        case Native.choose:
            return create_sym_id("choose", Native.choose);
        case Native.circexp:
            return create_sym_id("circexp", Native.circexp);
        case Native.clear:
            return create_sym_id("clear", Native.clear);
        case Native.clearall:
            return create_sym_id("clearall", Native.clearall);
        case Native.clock:
            return create_sym_id("clock", Native.clock);
        case Native.coeff:
            return create_sym_id("coeff", Native.coeff);
        case Native.coefficients:
            return create_sym_id("coefficients", Native.coefficients);
        case Native.cofactor:
            return create_sym_id("cofactor", Native.cofactor);
        case Native.complex:
            return create_sym_id("complex", Native.complex);
        case Native.component:
            return create_sym_id("component", Native.component);
        case Native.condense:
            return create_sym_id("condense", Native.condense);
        case Native.conj:
            return create_sym_id("conj", Native.conj);
        case Native.contract:
            return create_sym_id("contract", Native.contract);
        case Native.cos:
            return create_sym_id("cos", Native.cos);
        case Native.cosh:
            return create_sym_id("cosh", Native.cosh);
        case Native.cross:
            return create_sym_id("cross", Native.cross);
        case Native.curl:
            return create_sym_id("cur", Native.curl);
        case Native.d:
            return create_sym_id("d", Native.d);
        case Native.def:
            return create_sym_id("def", Native.def);
        case Native.defint:
            return create_sym_id("defint", Native.defint);
        case Native.defn:
            return create_sym_id("defn", Native.defn);
        case Native.deg:
            return create_sym_id("deg", Native.deg);
        case Native.deref:
            return create_sym_id("deref", Native.deref);
        case Native.derivative:
            return create_sym_id("derivative", Native.derivative);
        case Native.denominator:
            return create_sym_id("denominator", Native.denominator);
        case Native.det:
            return create_sym_id("det", Native.det);
        case Native.dim:
            return create_sym_id("dim", Native.dim);
        case Native.div:
            return create_sym_id("div", Native.div);
        case Native.divide:
            return create_sym_id("/", Native.divide);
        case Native.do:
            return create_sym_id("do", Native.do);
        case Native.dot:
            return create_sym_id("dot", Native.dot);
        case Native.draw:
            return create_sym_id("draw", Native.draw);
        case Native.eigen:
            return create_sym_id("eigen", Native.eigen);
        case Native.eigenval:
            return create_sym_id("eigenval", Native.eigenval);
        case Native.eigenvec:
            return create_sym_id("eigenvec", Native.eigenvec);
        case Native.erf:
            return create_sym_id("erf", Native.erf);
        case Native.erfc:
            return create_sym_id("erfc", Native.erfc);
        case Native.eval:
            return create_sym_id("eval", Native.eval);
        case Native.exp:
            return create_sym_id("exp", Native.exp);
        case Native.expand:
            return create_sym_id("expand", Native.expand);
        case Native.expcos:
            return create_sym_id("expcos", Native.expcos);
        case Native.expcosh:
            return create_sym_id("expcosh", Native.expcosh);
        case Native.expsin:
            return create_sym_id("expsin", Native.expsin);
        case Native.expsinh:
            return create_sym_id("expsinh", Native.expsinh);
        case Native.exptan:
            return create_sym_id("exptan", Native.exptan);
        case Native.exptanh:
            return create_sym_id("exptanh", Native.exptanh);
        case Native.factor:
            return create_sym_id("factor", Native.factor);
        case Native.factorial:
            return create_sym_id("factorial", Native.factorial);
        case Native.filter:
            return create_sym_id("filter", Native.filter);
        case Native.float:
            return create_sym_id("float", Native.float);
        case Native.floor:
            return create_sym_id("floor", Native.floor);
        case Native.for:
            return create_sym_id("for", Native.for);
        case Native.ascii:
            return create_sym_id("ascii", Native.ascii);
        case Native.human:
            return create_sym_id("human", Native.human);
        case Native.infix:
            return create_sym_id("infix", Native.infix);
        case Native.latex:
            return create_sym_id("latex", Native.latex);
        case Native.sexpr:
            return create_sym_id("sexpr", Native.sexpr);
        case Native.fn:
            return create_sym_id("fn", Native.fn);
        case Native.function:
            return create_sym_id("function", Native.function);
        case Native.gamma:
            return create_sym_id("gamma", Native.gamma);
        case Native.gcd:
            return create_sym_id("gcd", Native.gcd);
        case Native.grad:
            return create_sym_id("grad", Native.grad);
        case Native.grade:
            return create_sym_id("grade", Native.grade);
        case Native.hadamard:
            return create_sym_id("hadamard", Native.hadamard);
        case Native.hermite:
            return create_sym_id("hermite", Native.hermite);
        case Native.hilbert:
            return create_sym_id("hilbert", Native.hilbert);
        case Native.if:
            return create_sym_id("if", Native.if);
        case Native.imag:
            return create_sym_id("imag", Native.imag);
        case Native.infinitesimal:
            return create_sym_id("infinitesimal", Native.infinitesimal);
        case Native.inner:
            return create_sym_id("inner", Native.inner);
        case Native.integral:
            return create_sym_id("integral", Native.integral);
        case Native.inv:
            return create_sym_id("inv", Native.inv);
        case Native.invg:
            return create_sym_id("invg", Native.invg);
        case Native.iscomplex:
            return create_sym_id("iscomplex", Native.iscomplex);
        case Native.isimag:
            return create_sym_id("isimag", Native.isimag);
        case Native.isinfinite:
            return create_sym_id("isinfinite", Native.isinfinite);
        case Native.isinfinitesimal:
            return create_sym_id("isinfinitesimal", Native.isinfinitesimal);
        case Native.isnegative:
            return create_sym_id("isnegative", Native.isnegative);
        case Native.isone:
            return create_sym_id("isone", Native.isone);
        case Native.ispositive:
            return create_sym_id("ispositive", Native.ispositive);
        case Native.isprime:
            return create_sym_id("isprime", Native.isprime);
        case Native.isreal:
            return create_sym_id("isreal", Native.isreal);
        case Native.iszero:
            return create_sym_id("iszero", Native.iszero);
        case Native.kronecker:
            return create_sym_id("kronecker", Native.kronecker);
        case Native.laguerre:
            return create_sym_id("laguerre", Native.laguerre);
        case Native.last:
            return create_sym_id("last", Native.last);
        case Native.lcm:
            return create_sym_id("lcm", Native.lcm);
        case Native.lco:
            return create_sym_id("<<", Native.lco);
        case Native.leading:
            return create_sym_id("leading", Native.leading);
        case Native.legendre:
            return create_sym_id("legendre", Native.legendre);
        case Native.let:
            return create_sym_id("let", Native.let);
        case Native.log:
            return create_sym_id("log", Native.log);
        case Native.lookup:
            return create_sym_id("lookup", Native.lookup);
        case Native.mag:
            return create_sym_id("mag", Native.mag);
        case Native.major:
            return create_sym_id("major", Native.major);
        case Native.minor:
            return create_sym_id("minor", Native.minor);
        case Native.minormatrix:
            return create_sym_id("minormatrix", Native.minormatrix);
        case Native.mod:
            return create_sym_id("mod", Native.mod);
        case Native.multiply:
            return create_sym_id("*", Native.multiply);
        case Native.noexpand:
            return create_sym_id("noexpand", Native.noexpand);
        case Native.not:
            return create_sym_id("not", Native.not);
        case Native.nroots:
            return create_sym_id("nroots", Native.nroots);
        case Native.number:
            return create_sym_id("number", Native.number);
        case Native.numerator:
            return create_sym_id("numerator", Native.numerator);
        case Native.or:
            return create_sym_id("or", Native.or);
        case Native.outer:
            return create_sym_id("outer", Native.outer);
        case Native.patch:
            return create_sym_id("patch", Native.patch);
        case Native.pattern:
            return create_sym_id("pattern", Native.pattern);
        case Native.polar:
            return create_sym_id("polar", Native.polar);
        case Native.pow:
            return create_sym_id("pow", Native.pow);
        case Native.pred:
            return create_sym_id("pred", Native.pred);
        case Native.prime:
            return create_sym_id("prime", Native.prime);
        case Native.print:
            return create_sym_id("print", Native.print);
        case Native.product:
            return create_sym_id("product", Native.product);
        case Native.quote:
            return create_sym_id("quote", Native.quote);
        case Native.quotient:
            return create_sym_id("quotient", Native.quotient);
        case Native.rank:
            return create_sym_id("rank", Native.rank);
        case Native.rationalize:
            return create_sym_id("rationalize", Native.rationalize);
        case Native.real:
            return create_sym_id("real", Native.real);
        case Native.rect:
            return create_sym_id("rect", Native.rect);
        case Native.rco:
            return create_sym_id(">>", Native.rco);
        case Native.roots:
            return create_sym_id("roots", Native.roots);
        case Native.rotate:
            return create_sym_id("rotate", Native.rotate);
        case Native.round:
            return create_sym_id("round", Native.round);
        case Native.run:
            return create_sym_id("run", Native.run);
        case Native.shape:
            return create_sym_id("shape", Native.shape);
        case Native.simplify:
            return create_sym_id("simplify", Native.simplify);
        case Native.sin:
            return create_sym_id("sin", Native.sin);
        case Native.sinh:
            return create_sym_id("sinh", Native.sinh);
        case Native.sqrt:
            return create_sym_id("sqrt", Native.sqrt);
        case Native.spread:
            return create_sym_id("...", Native.spread);
        case Native.st:
            return create_sym_id("st", Native.st);
        case Native.stop:
            return create_sym_id("stop", Native.stop);
        case Native.subst:
            return create_sym_id("subst", Native.subst);
        case Native.subtract:
            return create_sym_id("-", Native.subtract);
        case Native.succ:
            return create_sym_id("succ", Native.succ);
        case Native.sum:
            return create_sym_id("sum", Native.sum);
        case Native.symbol:
            return create_sym_id("symbol", Native.symbol);
        case Native.tan:
            return create_sym_id("tan", Native.tan);
        case Native.tanh:
            return create_sym_id("tanh", Native.tanh);
        case Native.tau:
            return create_sym_id("tau", Native.tau);
        case Native.taylor:
            return create_sym_id("taylor", Native.taylor);
        case Native.test:
            return create_sym_id("test", Native.test);
        case Native.testeq:
            return create_sym_id("==", Native.testeq);
        case Native.testge:
            return create_sym_id(">=", Native.testge);
        case Native.testgt:
            return create_sym_id(">", Native.testgt);
        case Native.testle:
            return create_sym_id("<=", Native.testle);
        case Native.testlt:
            return create_sym_id("<", Native.testlt);
        case Native.testne:
            return create_sym_id("!=", Native.testne);
        case Native.trace:
            return create_sym_id("trace", Native.trace);
        case Native.transpose:
            return create_sym_id("transpose", Native.transpose);
        case Native.tty:
            return create_sym_id("tty", Native.tty);
        case Native.typeof:
            return create_sym_id("typeof", Native.typeof);
        case Native.unit:
            return create_sym_id("unit", Native.unit);
        case Native.uom:
            return create_sym_id("uom", Native.uom);
        case Native.version:
            return create_sym_id("version", Native.version);
        case Native.zero:
            return create_sym_id("zero", Native.zero);
        default:
            throw new Error(`${code} symbol is not defined.`);
    }
}
