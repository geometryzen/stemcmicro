import bigInt from 'big-integer';
import { create_sym } from '../tree/sym/Sym';
import { MATH_ADD, MATH_COMPONENT, MATH_FACTORIAL, MATH_INV, MATH_MUL, MATH_PI, MATH_POW, MATH_SIN } from './ns_math';

export const dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication = true;
export const do_simplify_nested_radicals = true;
export const avoidCalculatingPowersIntoArctans = true;

// TODO: Migrate to a situation of only creating these on demand by extensions.
export const ADD = MATH_ADD;
export const ADJ = create_sym('adj');
export const ALGEBRA = create_sym('algebra');
export const AND = create_sym('and');
export const APPROXRATIO = create_sym('approxratio');
export const ARCCOS = create_sym('arccos');
export const ARCCOSH = create_sym('arccosh');
export const ARCSIN = create_sym('arcsin');
export const ARCSINH = create_sym('arcsinh');
export const ARCTAN = create_sym('arctan');
export const ARCTANH = create_sym('arctanh');
export const ATOMIZE = create_sym('atomize');
export const BESSELJ = create_sym('besselj');
export const BESSELY = create_sym('bessely');
export const BINDING = create_sym('binding');
export const BINOMIAL = create_sym('binomial');
export const CEILING = create_sym('ceiling');
export const CHECK = create_sym('check');
export const CHOOSE = create_sym('choose');
export const CIRCEXP = create_sym('circexp');
export const CLEAR = create_sym('clear');
export const CLEARALL = create_sym('clearall');
export const CLEARPATTERNS = create_sym('clearpatterns');
export const CLOCK = create_sym('clock');
export const COEFF = create_sym('coeff');
export const COFACTOR = create_sym('cofactor');
export const COMPARE = create_sym('compare');
export const COMPARE_FACTORS = create_sym('compare-factors');
export const COMPARE_TERMS = create_sym('compare-terms');
export const CONDENSE = create_sym('condense');
export const CONJ = create_sym('conj');
export const CONTRACT = create_sym('contract');
export const COS = create_sym('cos');
export const COSH = create_sym('cosh');
export const DECOMP = create_sym('decomp');
export const DEFINT = create_sym('defint');
export const DEGREE = create_sym('degree');
export const DENOMINATOR = create_sym('denominator');
export const DET = create_sym('det');
export const DIM = create_sym('dim');
export const DIRAC = create_sym('dirac');
export const DIVIDE = create_sym('divide');
export const DIVISORS = create_sym('divisors');
export const DO = create_sym('do');
export const DOT = create_sym('dot');
export const DRAW = create_sym('draw');
export const DSOLVE = create_sym('dsolve');
export const EIGEN = create_sym('eigen');
export const EIGENVAL = create_sym('eigenval');
export const EIGENVEC = create_sym('eigenvec');
export const EQUAL = create_sym('equal');
export const ERF = create_sym('erf');
export const ERFC = create_sym('erfc');
export const EVAL = create_sym('eval');
export const EXP = create_sym('exp');
export const EXPAND = create_sym('expand');
export const EXPCOS = create_sym('expcos');
export const EXPSIN = create_sym('expsin');
export const FACTOR = create_sym('factor');
export const FACTORIAL = MATH_FACTORIAL;
export const FACTORPOLY = create_sym('factorpoly');
export const FILTER = create_sym('filter');
export const FLOAT = create_sym('float');
export const FLOOR = create_sym('floor');
export const FOR = create_sym('for');
export const FUNCTION = create_sym('function');
export const GAMMA = create_sym('gamma');
export const GCD = create_sym('gcd');
export const HERMITE = create_sym('hermite');
export const HILBERT = create_sym('hilbert');
export const IF = create_sym('if');
export const IMAG = create_sym('imag');
export const SYM_MATH_COMPONENT = MATH_COMPONENT;
export const INTEGRAL = create_sym('integral');
export const INV = MATH_INV;
export const INVG = create_sym('invg');
export const ISINTEGER = create_sym('isinteger');
export const ISPRIME = create_sym('isprime');
export const LAGUERRE = create_sym('laguerre');
export const LAPLACE = create_sym('laplace');
export const LCM = create_sym('lcm');
export const LCO = create_sym('lco');
export const LEADING = create_sym('leading');
export const LEGENDRE = create_sym('legendre');
export const LOG = create_sym('log');
export const LOOKUP = create_sym('lookup');
export const MOD = create_sym('mod');
export const MULTIPLY = MATH_MUL;
export const NOT = create_sym('not');
export const NROOTS = create_sym('nroots');
export const NUMBER = create_sym('number');
export const NUMERATOR = create_sym('numerator');
export const OPERATOR = create_sym('operator');
export const OR = create_sym('or');
export const PATTERN = create_sym('pattern');
export const PATTERNSINFO = create_sym('patternsinfo');
export const POLAR = create_sym('polar');
export const POWER = MATH_POW;
export const PRIME = create_sym('prime');
export const PRINT_LEAVE_E_ALONE = create_sym('printLeaveEAlone');
export const PRINT_LEAVE_X_ALONE = create_sym('printLeaveXAlone');
export const PRINT = create_sym('print');
export const PRODUCT = create_sym('product');
export const QUOTE = create_sym('quote');
export const QUOTIENT = create_sym('quotient');
export const RANK = create_sym('rank');
export const RATIONALIZE = create_sym('rationalize');
export const RCO = create_sym('rco');
export const REAL = create_sym('real');
export const ROUND = create_sym('round');
export const RECT = create_sym('rect');
export const ROOTS = create_sym('roots');
export const ASSIGN = create_sym('=');
export const SGN = create_sym('sgn');
export const SILENTPATTERN = create_sym('silentpattern');
export const SIMPLIFY = create_sym('simplify');
export const SIN = MATH_SIN;
export const SINH = create_sym('sinh');
export const SHAPE = create_sym('shape');
export const SQRT = create_sym('sqrt');
export const STOP = create_sym('stop');
export const SUBST = create_sym('subst');
export const SUBTRACT = create_sym('-');
export const SUM = create_sym('sum');
export const SYMBOLSINFO = create_sym('symbolsinfo');
export const TAN = create_sym('tan');
export const TANH = create_sym('tanh');
export const TAYLOR = create_sym('taylor');
export const TEST = create_sym('test');
export const TESTEQ = create_sym('testeq');
export const TESTGE = create_sym('testge');
export const TESTGT = create_sym('testgt');
export const TESTLE = create_sym('testle');
export const TESTLT = create_sym('testlt');
export const TRANSPOSE = create_sym('transpose');
export const UNIT = create_sym('unit');
export const UOM = create_sym('uom');
export const ZERO = create_sym('zero');

export const LAST_PRINT = create_sym('lastPrint');
export const LAST_ASCII_PRINT = create_sym('lastAsciiPrint');
export const LAST_INFIX_PRINT = create_sym('lastInfixPrint');
export const LAST_LATEX_PRINT = create_sym('lastLatexPrint');
export const LAST_SEXPR_PRINT = create_sym('lastSexprPrint');
export const LAST_HUMAN_PRINT = create_sym('lastHumanPrint');

export const AUTOEXPAND = create_sym('autoexpand');
export const BAKE = create_sym('bake');
export const ASSUME_REAL_VARIABLES = create_sym('assumeRealVariables');
export const TRACE = create_sym('trace');
export const FORCE_FIXED_PRINTOUT = create_sym('forceFixedPrintout');
export const VARNAME_MAX_FIXED_PRINTOUT_DIGITS = create_sym('maxFixedPrintoutDigits');
export const DEFAULT_MAX_FIXED_PRINTOUT_DIGITS = 6;

export const DRAWX = create_sym('$DRAWX');
export const METAA = create_sym('$METAA');
export const METAB = create_sym('$METAB');
export const METAX = create_sym('$METAX');
export const SECRETX = create_sym('$SECRETX');

export const VERSION = create_sym('version');

/**
 * TODO: Don't use this. Just use MATH_PI. It's the same thing.
 */
export const PI = MATH_PI;
/**
 * 'a'
 */
export const SYMBOL_A = create_sym('a');
export const SYMBOL_B = create_sym('b');
export const SYMBOL_C = create_sym('c');
export const SYMBOL_D = create_sym('d');
export const SYMBOL_I = create_sym('i');
export const SYMBOL_J = create_sym('j');
export const SYMBOL_N = create_sym('n');
export const SYMBOL_R = create_sym('r');
export const SYMBOL_S = create_sym('s');
export const SYMBOL_T = create_sym('t');
export const SYMBOL_X = create_sym('x');
export const SYMBOL_Y = create_sym('y');
export const SYMBOL_Z = create_sym('z');
export const SYMBOL_IDENTITY_MATRIX = create_sym('I');

export const SYMBOL_A_UNDERSCORE = create_sym('a_');
export const SYMBOL_B_UNDERSCORE = create_sym('b_');
export const SYMBOL_X_UNDERSCORE = create_sym('x_');

export const C1 = create_sym('$C1');
export const C2 = create_sym('$C2');
export const C3 = create_sym('$C3');
export const C4 = create_sym('$C4');
export const C5 = create_sym('$C5');
export const C6 = create_sym('$C6');

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
 * p.equals(n)
 * @deprecated Find a way to do it through the Rat, encapsulating the BigInteger.
 */
export function MEQUAL(p: bigInt.BigInteger, n: number): boolean {
    return p.equals(n);
}
