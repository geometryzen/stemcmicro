import { BigInteger, create_sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { MATH_COS, MATH_FACTORIAL, MATH_INV, MATH_MUL, MATH_POW, MATH_SIN, MATH_TAN } from "./ns_math";

export const do_simplify_nested_radicals = true;
export const avoidCalculatingPowersIntoArctans = true;

// TODO: Migrate to a situation of only creating these on demand by extensions.
export const ADD = native_sym(Native.add);
export const ADJ = create_sym("adj");
export const ALGEBRA = create_sym("algebra");
export const AND = create_sym("and");
export const APPROXRATIO = create_sym("approxratio");
export const ARCCOS = create_sym("arccos");
export const ARCCOSH = create_sym("arccosh");
export const ARCSIN = create_sym("arcsin");
export const ARCSINH = create_sym("arcsinh");
export const ARCTAN = create_sym("arctan");
export const ARCTANH = create_sym("arctanh");
export const ATOMIZE = create_sym("atomize");
export const BESSELJ = create_sym("besselj");
export const BESSELY = create_sym("bessely");
export const BINDING = create_sym("binding");
export const BINOMIAL = create_sym("binomial");
export const CEILING = create_sym("ceiling");
export const CHECK = create_sym("check");
export const CHOOSE = create_sym("choose");
export const CIRCEXP = native_sym(Native.circexp);
export const CLEAR = create_sym("clear");
export const CLEARALL = create_sym("clearall");
export const CLEARPATTERNS = create_sym("clearpatterns");
export const COEFF = create_sym("coeff");
export const COFACTOR = create_sym("cofactor");
export const COMPARE = create_sym("compare");
export const COMPARE_FACTORS = create_sym("compare-factors");
export const COMPARE_TERMS = create_sym("compare-terms");
export const COMPONENT = native_sym(Native.component);
export const CONDENSE = native_sym(Native.condense);
export const CONTRACT = create_sym("contract");
export const COS = MATH_COS;
export const COSH = create_sym("cosh");
export const DECOMP = create_sym("decomp");
export const DEFINT = create_sym("defint");
export const DENOMINATOR = create_sym("denominator");
export const DET = create_sym("det");
export const DIM = create_sym("dim");
export const DIRAC = create_sym("dirac");
export const DIVIDE = create_sym("divide");
export const DIVISORS = create_sym("divisors");
export const DO = create_sym("do");
export const DOT = create_sym("dot");
export const DRAW = create_sym("draw");
export const DSOLVE = create_sym("dsolve");
export const EIGEN = create_sym("eigen");
export const EIGENVAL = create_sym("eigenval");
export const EIGENVEC = create_sym("eigenvec");
export const EQUAL = create_sym("equal");
export const ERF = create_sym("erf");
export const ERFC = create_sym("erfc");
/**
 * 'eval'
 */
export const EVAL = create_sym("eval");
export const EXP = native_sym(Native.exp);
export const EXPAND = native_sym(Native.expand);
export const EXPCOS = create_sym("expcos");
export const FACTOR = native_sym(Native.factor);
export const FACTORIAL = MATH_FACTORIAL;
export const FACTORPOLY = create_sym("factorpoly");
export const FLOAT = native_sym(Native.float);
export const FLOOR = create_sym("floor");
/**
 * (fn [params*] expr*)
 */
export const FN = native_sym(Native.fn);
export const FOR = create_sym("for");
/**
 * (Sym("function") body paramList)
 *
 * Notice that the syntax is different from ClojureScript, which is (fn params body), and params is a Tensor of symbols.
 */
export const FUNCTION = native_sym(Native.function);
export const GAMMA = create_sym("gamma");
export const GCD = native_sym(Native.gcd);
export const HERMITE = native_sym(Native.hermite);
export const HILBERT = native_sym(Native.hilbert);
export const IF = create_sym("if");
export const IMAG = native_sym(Native.imag);
export const INNER = native_sym(Native.inner);
export const INTEGRAL = native_sym(Native.integral);
export const INV = MATH_INV;
export const INVG = create_sym("invg");
export const ISINTEGER = create_sym("isinteger");
export const ISPRIME = native_sym(Native.isprime);
export const LAGUERRE = create_sym("laguerre");
export const LAPLACE = create_sym("laplace");
export const LCM = create_sym("lcm");
export const LCO = native_sym(Native.lco);
export const LEGENDRE = create_sym("legendre");
export const LET = create_sym("let");
export const LOG = native_sym(Native.log);
export const MULTIPLY = MATH_MUL;
export const NOT = native_sym(Native.not);
export const NROOTS = create_sym("nroots");
export const NUMBER = create_sym("number");
export const NUMERATOR = create_sym("numerator");
export const OPERATOR = create_sym("operator");
export const OR = create_sym("or");
export const OUTER = native_sym(Native.outer);
export const PATTERN = create_sym("pattern");
export const POLAR = native_sym(Native.polar);
export const POWER = MATH_POW;
export const PRINT_LEAVE_E_ALONE = create_sym("printLeaveEAlone");
export const PRINT_LEAVE_X_ALONE = create_sym("printLeaveXAlone");
export const PRINT = create_sym("print");
export const PRODUCT = create_sym("product");
export const QUOTE = create_sym("quote");
export const QUOTIENT = create_sym("quotient");
export const RANK = create_sym("rank");
export const RCO = native_sym(Native.rco);
export const REAL = native_sym(Native.real);
export const ISREAL = native_sym(Native.isreal);
export const ROUND = create_sym("round");
export const RECT = native_sym(Native.rect);
export const ROOTS = create_sym("roots");
export const ASSIGN = native_sym(Native.assign);
export const SGN = create_sym("sgn");
export const SIN = MATH_SIN;
export const SINH = create_sym("sinh");
export const SHAPE = create_sym("shape");
export const SQRT = create_sym("sqrt");
export const STOP = create_sym("stop");
export const SUBST = native_sym(Native.subst);
export const SUBTRACT = create_sym("-");
export const SUM = create_sym("sum");
export const TAN = MATH_TAN;
export const TANH = create_sym("tanh");
export const TAYLOR = native_sym(Native.taylor);
export const TEST = native_sym(Native.test);
export const TESTGE = native_sym(Native.testge);
export const TESTGT = native_sym(Native.testgt);
export const TESTLE = native_sym(Native.testle);
export const TESTLT = native_sym(Native.testlt);
export const TRANSPOSE = create_sym("transpose");
export const UNIT = create_sym("unit");
export const UOM = create_sym("uom");
export const ZERO = native_sym(Native.zero);

export const LAST_PRINT = create_sym("lastPrint");
export const LAST_ASCII_PRINT = create_sym("lastAsciiPrint");
export const LAST_INFIX_PRINT = create_sym("lastInfixPrint");
export const LAST_LATEX_PRINT = create_sym("lastLatexPrint");
export const LAST_SEXPR_PRINT = create_sym("lastSexprPrint");
export const LAST_HUMAN_PRINT = create_sym("lastHumanPrint");

export const AUTOEXPAND = create_sym("autoexpand");
export const AUTOFACTOR = create_sym("autofactor");
export const BAKE = create_sym("bake");
export const TRACE = create_sym("trace");

export const METAA = create_sym("$METAA");
export const METAB = create_sym("$METAB");
export const METAX = create_sym("$METAX");

export const SECRETX = create_sym("$SECRETX");

export const VERSION = create_sym("version");
/**
 * 'a'
 */
export const SYMBOL_A = create_sym("a");
export const SYMBOL_B = create_sym("b");
export const SYMBOL_C = create_sym("c");
/**
 * 'd' is commonly used for the derivative.
 */
export const SYMBOL_D = create_sym("d");
export const SYMBOL_I = create_sym("i");
export const SYMBOL_J = create_sym("j");
export const SYMBOL_N = create_sym("n");
export const SYMBOL_R = create_sym("r");
export const SYMBOL_S = create_sym("s");
export const SYMBOL_T = create_sym("t");
/**
 * x
 */
export const SYMBOL_X = create_sym("x");
export const SYMBOL_Y = create_sym("y");
export const SYMBOL_Z = create_sym("z");
export const SYMBOL_IDENTITY_MATRIX = create_sym("I");

export const SYMBOL_A_UNDERSCORE = create_sym("a_");
export const SYMBOL_B_UNDERSCORE = create_sym("b_");
export const SYMBOL_X_UNDERSCORE = create_sym("x_");

export const C1 = create_sym("$C1");
export const C2 = create_sym("$C2");
export const C3 = create_sym("$C3");
export const C4 = create_sym("$C4");
export const C5 = create_sym("$C5");
export const C6 = create_sym("$C6");

export const MAXPRIMETAB = 10000;
export const MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES = 5;
export const MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE = 10;

//define _USE_MATH_DEFINES // for MS C++

export const MAXDIM = 24;

export const predefinedSymbolsInGlobalScope_doNotTrackInDependencies = [
    "rationalize",
    "abs",
    "e",
    "i",
    "pi",
    "sin",
    "ceiling",
    "cos",
    "roots",
    "integral",
    "derivative",
    "defint",
    "sqrt",
    "eig",
    "cov",
    "deig",
    "dcov",
    "float",
    "floor",
    "product",
    "root",
    "round",
    "sum",
    "test",
    "unit"
];

export const primetab = (function () {
    const primes = [2];
    let i = 3;
    while (primes.length < MAXPRIMETAB) {
        let j = 0;
        const ceil = Math.sqrt(i);
        while (j < primes.length && primes[j] <= ceil) {
            if (i % primes[j] === 0) {
                j = -1;
                break;
            }
            j++;
        }
        if (j !== -1) {
            primes.push(i);
        }
        i += 2;
    }
    primes[MAXPRIMETAB] = 0;
    return primes;
})();

export const mtotal = 0;
export const logbuf = "";

export const TRANSPOSE_CHAR_CODE = 7488;
export const TRANSPOSE_STRING = String.fromCharCode(TRANSPOSE_CHAR_CODE);
export const TRANSPOSE_REGEX_GLOBAL = new RegExp(TRANSPOSE_STRING, "g");

/**
 * Middle or Center Dot. 183 = 0xB7
 */
export const MIDDLE_DOT_CHAR_CODE = 183;
export const MIDDLE_DOT_STRING = String.fromCharCode(MIDDLE_DOT_CHAR_CODE);
export const MIDDLE_DOT_REGEX_GLOBAL = new RegExp(MIDDLE_DOT_STRING, "g");

export function MSIGN(p: BigInteger): 1 | -1 | 0 {
    if (p.isZero()) {
        return 0;
    }
    if (p.isPositive()) {
        return 1;
    }
    return -1;
}

/**
 * p.equals(n)
 */
export function MEQUAL(p: BigInteger, n: number): boolean {
    return p.equals(n);
}
