import bigInt from 'big-integer';
import { Sym } from '../tree/sym/Sym';
import { MATH_ADD, MATH_ARG, MATH_COMPONENT, MATH_FACTORIAL, MATH_INNER, MATH_INV, MATH_MUL, MATH_OUTER, MATH_PI, MATH_POW, MATH_SIN } from './ns_math';
import { NAME_SCRIPT_LAST } from './ns_script';

export const dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication = true;
export const do_simplify_nested_radicals = true;
export const avoidCalculatingPowersIntoArctans = true;

// TODO: Migrate to a situation of only creating these on demand by extensions.
export const ADD = MATH_ADD;
export const ADJ = new Sym('adj');
export const ALGEBRA = new Sym('algebra');
export const AND = new Sym('and');
export const APPROXRATIO = new Sym('approxratio');
export const ARCCOS = new Sym('arccos');
export const ARCCOSH = new Sym('arccosh');
export const ARCSIN = new Sym('arcsin');
export const ARCSINH = new Sym('arcsinh');
export const ARCTAN = new Sym('arctan');
export const ARCTANH = new Sym('arctanh');
export const ARG = MATH_ARG;
export const ATOMIZE = new Sym('atomize');
export const BESSELJ = new Sym('besselj');
export const BESSELY = new Sym('bessely');
export const BINDING = new Sym('binding');
export const BINOMIAL = new Sym('binomial');
export const CEILING = new Sym('ceiling');
export const CHECK = new Sym('check');
export const CHOOSE = new Sym('choose');
export const CIRCEXP = new Sym('circexp');
export const CLEAR = new Sym('clear');
export const CLEARALL = new Sym('clearall');
export const CLEARPATTERNS = new Sym('clearpatterns');
export const CLOCK = new Sym('clock');
export const COEFF = new Sym('coeff');
export const COFACTOR = new Sym('cofactor');
export const COMPARE = new Sym('compare');
export const COMPARE_FACTORS = new Sym('compare-factors');
export const COMPARE_TERMS = new Sym('compare-terms');
export const CONDENSE = new Sym('condense');
export const CONJ = new Sym('conj');
export const CONTRACT = new Sym('contract');
export const COS = new Sym('cos');
export const COSH = new Sym('cosh');
export const DECOMP = new Sym('decomp');
export const DEFINT = new Sym('defint');
export const DEGREE = new Sym('degree');
export const DENOMINATOR = new Sym('denominator');
export const DET = new Sym('det');
export const DIM = new Sym('dim');
export const DIRAC = new Sym('dirac');
export const DIVIDE = new Sym('divide');
export const DIVISORS = new Sym('divisors');
export const DO = new Sym('do');
export const DOT = new Sym('dot');
export const DRAW = new Sym('draw');
export const DSOLVE = new Sym('dsolve');
export const EIGEN = new Sym('eigen');
export const EIGENVAL = new Sym('eigenval');
export const EIGENVEC = new Sym('eigenvec');
export const EQUAL = new Sym('equal');
export const ERF = new Sym('erf');
export const ERFC = new Sym('erfc');
export const EVAL = new Sym('eval');
export const EXP = new Sym('exp');
export const EXPAND = new Sym('expand');
export const EXPCOS = new Sym('expcos');
export const EXPSIN = new Sym('expsin');
export const FACTOR = new Sym('factor');
export const FACTORIAL = MATH_FACTORIAL;
export const FACTORPOLY = new Sym('factorpoly');
export const FILTER = new Sym('filter');
export const FLOAT = new Sym('float');
export const FLOOR = new Sym('floor');
export const FOR = new Sym('for');
export const FUNCTION = new Sym('function');
export const GAMMA = new Sym('gamma');
export const GCD = new Sym('gcd');
export const HERMITE = new Sym('hermite');
export const HILBERT = new Sym('hilbert');
export const IF = new Sym('if');
export const IMAG = new Sym('imag');
export const SYM_MATH_COMPONENT = MATH_COMPONENT;
export const INNER = MATH_INNER;
export const INTEGRAL = new Sym('integral');
export const INV = MATH_INV;
export const INVG = new Sym('invg');
export const ISINTEGER = new Sym('isinteger');
export const ISPRIME = new Sym('isprime');
export const LAGUERRE = new Sym('laguerre');
export const LAPLACE = new Sym('laplace');
export const LCM = new Sym('lcm');
export const LCO = new Sym('lco');
export const LEADING = new Sym('leading');
export const LEGENDRE = new Sym('legendre');
export const LOG = new Sym('log');
export const LOOKUP = new Sym('lookup');
export const MOD = new Sym('mod');
export const MULTIPLY = MATH_MUL;
export const NOT = new Sym('not');
export const NROOTS = new Sym('nroots');
export const NUMBER = new Sym('number');
export const NUMERATOR = new Sym('numerator');
export const OPERATOR = new Sym('operator');
export const OR = new Sym('or');
export const OUTER = MATH_OUTER;
export const PATTERN = new Sym('pattern');
export const PATTERNSINFO = new Sym('patternsinfo');
export const POLAR = new Sym('polar');
export const POWER = MATH_POW;
export const PRIME = new Sym('prime');
export const PRINT_LEAVE_E_ALONE = new Sym('printLeaveEAlone');
export const PRINT_LEAVE_X_ALONE = new Sym('printLeaveXAlone');
export const PRINT = new Sym('print');
export const PRINT2DASCII = new Sym('print2dascii');
export const PRINTFULL = new Sym('printcomputer');
export const PRINTLATEX = new Sym('printlatex');
export const PRINTLIST = new Sym('printlist');
export const PRINTPLAIN = new Sym('printhuman');
export const PRODUCT = new Sym('product');
export const QUOTE = new Sym('quote');
export const QUOTIENT = new Sym('quotient');
export const RANK = new Sym('rank');
export const RATIONALIZE = new Sym('rationalize');
export const RCO = new Sym('rco');
export const REAL = new Sym('real');
export const ROUND = new Sym('round');
export const YYRECT = new Sym('rect');
export const ROOTS = new Sym('roots');
export const ASSIGN = new Sym('=');
export const SGN = new Sym('sgn');
export const SILENTPATTERN = new Sym('silentpattern');
export const SIMPLIFY = new Sym('simplify');
export const SIN = MATH_SIN;
export const SINH = new Sym('sinh');
export const SHAPE = new Sym('shape');
export const SQRT = new Sym('sqrt');
export const STOP = new Sym('stop');
export const SUBST = new Sym('subst');
export const SUBTRACT = new Sym('-');
export const SUM = new Sym('sum');
export const SYMBOLSINFO = new Sym('symbolsinfo');
export const TAN = new Sym('tan');
export const TANH = new Sym('tanh');
export const TAYLOR = new Sym('taylor');
export const TEST = new Sym('test');
export const TESTEQ = new Sym('testeq');
export const TESTGE = new Sym('testge');
export const TESTGT = new Sym('testgt');
export const TESTLE = new Sym('testle');
export const TESTLT = new Sym('testlt');
export const TRANSPOSE = new Sym('transpose');
export const UNIT = new Sym('unit');
export const UOM = new Sym('uom');
export const ZERO = new Sym('zero');

export const LAST = NAME_SCRIPT_LAST;

export const LAST_PRINT = new Sym('lastprint');
export const LAST_2DASCII_PRINT = new Sym('last2dasciiprint');
export const LAST_COMPUTER_PRINT = new Sym('lastfullprint');
export const LAST_LATEX_PRINT = new Sym('lastlatexprint');
export const LAST_LIST_PRINT = new Sym('lastlistprint');
export const LAST_HUMAN_PRINT = new Sym('lastplainprint');

export const AUTOEXPAND = new Sym('autoexpand');
export const AUTOFACTOR = new Sym('autofactor');
export const BAKE = new Sym('bake');
export const ASSUME_REAL_VARIABLES = new Sym('assumeRealVariables');
export const EXPLICATE = new Sym('explicate');
export const IMPLICATE = new Sym('implicate');
export const PRETTYFMT = new Sym('prettyfmt');
export const TRACE = new Sym('trace');
export const FORCE_FIXED_PRINTOUT = new Sym('forceFixedPrintout');
export const MAX_FIXED_PRINTOUT_DIGITS = new Sym('maxFixedPrintoutDigits');

export const DRAWX = new Sym('$DRAWX');
export const METAB = new Sym('$METAB');
export const METAX = new Sym('$METAX');
export const SECRETX = new Sym('$SECRETX');

export const VERSION = new Sym('version');

/**
 * TODO: Don't use this. Just use MATH_PI. It's the same thing.
 */
export const PI = MATH_PI;
/**
 * 'a'
 */
export const SYMBOL_A = new Sym('a');
export const SYMBOL_B = new Sym('b');
export const SYMBOL_C = new Sym('c');
export const SYMBOL_D = new Sym('d');
export const SYMBOL_I = new Sym('i');
export const SYMBOL_J = new Sym('j');
export const SYMBOL_N = new Sym('n');
export const SYMBOL_R = new Sym('r');
export const SYMBOL_S = new Sym('s');
export const SYMBOL_T = new Sym('t');
export const SYMBOL_X = new Sym('x');
export const SYMBOL_Y = new Sym('y');
export const SYMBOL_Z = new Sym('z');
export const SYMBOL_IDENTITY_MATRIX = new Sym('I');

export const SYMBOL_A_UNDERSCORE = new Sym('a_');
export const SYMBOL_B_UNDERSCORE = new Sym('b_');
export const SYMBOL_X_UNDERSCORE = new Sym('x_');

export const C1 = new Sym('$C1');
export const C2 = new Sym('$C2');
export const C3 = new Sym('$C3');
export const C4 = new Sym('$C4');
export const C5 = new Sym('$C5');
export const C6 = new Sym('$C6');

export const MAXPRIMETAB = 10000;
export const MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES = 5;
export const MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE = 10;

//define _USE_MATH_DEFINES // for MS C++

export const MAXDIM = 24;

export const predefinedSymbolsInGlobalScope_doNotTrackInDependencies = [
    'rationalize',
    'abs',
    'e',
    'i',
    'pi',
    'sin',
    'ceiling',
    'cos',
    'roots',
    'integral',
    'derivative',
    'defint',
    'sqrt',
    'eig',
    'cov',
    'deig',
    'dcov',
    'float',
    'floor',
    'product',
    'root',
    'round',
    'sum',
    'test',
    'unit',
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
export const logbuf = '';

export const TRANSPOSE_CHAR_CODE = 7488;
export const TRANSPOSE_STRING = String.fromCharCode(TRANSPOSE_CHAR_CODE);
export const TRANSPOSE_REGEX_GLOBAL = new RegExp(TRANSPOSE_STRING, 'g');

/**
 * Middle or Center Dot. 183 = 0xB7
 */
export const MIDDLE_DOT_CHAR_CODE = 183;
export const MIDDLE_DOT_STRING = String.fromCharCode(MIDDLE_DOT_CHAR_CODE);
export const MIDDLE_DOT_REGEX_GLOBAL = new RegExp(MIDDLE_DOT_STRING, 'g');

export function MSIGN(p: bigInt.BigInteger): 1 | -1 | 0 {
    if (p.isZero()) {
        return 0;
    }
    if (p.isPositive()) {
        return 1;
    }
    return -1;
}

/**
 * @deprecated Find a way to do it through the Rat, encapsulating the BigInteger.
 */
export function MEQUAL(p: bigInt.BigInteger, n: number): boolean {
    return p.equals(n);
}
