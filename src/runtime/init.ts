import { ExtensionEnv } from "../env/ExtensionEnv";
import { clear_patterns } from '../pattern';
import { scan } from '../scanner/scan';
import { defs } from './defs';
import { SymEngineOptions } from "./symengine";
import { version } from './version';

/**
 * #deprecated
 */
export function soft_reset($: ExtensionEnv): [codeGen: boolean] {
    clear_patterns();

    $.clearBindings();

    // Don't redo the keywords or NIL.
    define_special_symbols($);

    // We need to redo these...
    execute_definitions(void 0, $);

    return [(defs.codeGen = false)];
}

/* cross =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept, script_defined

Parameters
----------
u,v

General description
-------------------
Returns the cross product of vectors u and v.

*/

/* curl =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept, script_defined

Parameters
----------
u

General description
-------------------
Returns the curl of vector u.

*/
/**
 * A bunch of strings that are scanned and evaluated, therby changing some bindings.
 * Concretely, the string "var = expr" becomes (set! var expr), where the expr has been evaluated.
 * This (set! var expr) is then evaluated and it becomes a binding of var to the expanded expression.
 * 
 */
const defn_strings = [
    `version="${version}"`,
    'e=exp(1)',
    'i=sqrt(-1)',
    'autoexpand=1',
    'autofactor=1',
    // TODO: Is setting this to zero really respected?
    'assumeRealVariables=1',
    'pi=tau(1)/2',
    'trange=[-pi,pi]',
    'xrange=[-10,10]',
    'yrange=[-10,10]',
    // TODO: remove these and make sure it still works when these are not bound.
    'last=0',
    'trace=0',
    'forceFixedPrintout=1',
    'maxFixedPrintoutDigits=6',
    'printLeaveEAlone=1',
    'printLeaveXAlone=0',
    // cross definition
    // 'cross(u,v)=[u[2]*v[3]-u[3]*v[2],u[3]*v[1]-u[1]*v[3],u[1]*v[2]-u[2]*v[1]]',
    // curl definition
    // 'curl(v)=[d(v[3],y)-d(v[2],z),d(v[1],z)-d(v[3],x),d(v[2],x)-d(v[1],y)]',
    // div definition
    // 'div(v)=d(v[1],x)+d(v[2],y)+d(v[3],z)',
    // Note that we use the mathematics / Javascript / Mathematica
    // convention that "log" is indeed the natural logarithm.
    //
    // In engineering, biology, astronomy, "log" can stand instead
    // for the "common" logarithm i.e. base 10. Also note that Google
    // calculations use log for the common logarithm.
    // 'ln(x)=log(x)',
];

/**
 * Defines keywords, NIL, and special symbols.
 */
export function define_std_symbols($: ExtensionEnv): void {
    // console.lg('define_std_symbols');

    define_keywords($);

    define_special_symbols($);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function define_keywords($: ExtensionEnv): void {
    // console.lg('define_keywords');
    // $.defineSym(MATH_ABS);
    // $.defineSym(MATH_ADD);
    // $.defineSym(ADJ);
    // $.defineSym(ALGEBRA);
    // $.defineSym(AND);
    // $.defineSym(APPROXRATIO);
    // $.defineSym(ARCCOS);
    // $.defineSym(ARCCOSH);
    // $.defineSym(ARCSIN);
    // $.defineSym(ARCSINH);
    // $.defineSym(ARCTAN);
    // $.defineSym(ARCTANH);
    // $.defineSym(ARG);
    // $.defineSym(ATOMIZE);
    // $.defineSym(BESSELJ);
    // $.defineSym(BESSELY);
    // $.defineSym(BINDING);
    // $.defineSym(BINOMIAL);
    // $.defineSym(CEILING);
    // $.defineSym(CHECK);
    // $.defineSym(CHOOSE);
    // $.defineSym(CIRCEXP);
    // $.defineSym(CLEAR);
    // $.defineSym(CLEARALL);
    // $.defineSym(CLEARPATTERNS);
    // $.defineSym(CLOCK);
    // $.defineSym(COEFF);
    // $.defineSym(COFACTOR);
    // $.defineSym(COMPARE);
    // $.defineSym(COMPARE_FACTORS);
    // $.defineSym(COMPARE_TERMS);
    // $.defineSym(CONDENSE);
    // $.defineSym(CONJ);
    // $.defineSym(CONTRACT);
    // $.defineSym(COS);
    // $.defineSym(COSH);
    // $.defineSym(DECOMP);
    // $.defineSym(DEFINT);
    // $.defineSym(DEGREE);
    // $.defineSym(DENOMINATOR);
    // $.defineSym(DET);
    // $.defineSym(DERIVATIVE);
    // $.defineSym(DIM);
    // $.defineSym(DIRAC);
    // $.defineSym(DIVIDE);
    // $.defineSym(DIVISORS);
    // $.defineSym(DO);
    // $.defineSym(DOT);
    // $.defineSym(DRAW);
    // $.defineSym(DSOLVE);
    // $.defineSym(EQUAL);
    // $.defineSym(ERF);
    // $.defineSym(ERFC);
    // $.defineSym(EIGEN);
    // $.defineSym(EIGENVAL);
    // $.defineSym(EIGENVEC);
    // $.defineSym(EVAL);
    // $.defineSym(EXP);
    // $.defineSym(EXPAND);
    // $.defineSym(EXPCOS);
    // $.defineSym(EXPSIN);
    // $.defineSym(FACTOR);
    // $.defineSym(FACTORIAL);
    // $.defineSym(FACTORPOLY);
    // $.defineSym(FILTER);
    // $.defineSym(FLOATF);
    // $.defineSym(FLOOR);
    // $.defineSym(FOR);
    // $.defineSym(FUNCTION);
    // $.defineSym(GAMMA);
    // $.defineSym(GCD);
    // $.defineSym(HERMITE);
    // $.defineSym(HILBERT);
    // $.defineSym(IF);
    // $.defineSym(IMAG);
    // $.defineSym(SYM_MATH_COMPONENT);
    // $.defineSym(INNER);
    // $.defineSym(INTEGRAL);
    // $.defineSym(INV);
    // $.defineSym(INVG);
    // $.defineSym(ISINTEGER);
    // $.defineSym(ISPRIME);
    // $.defineSym(LAGUERRE);
    // LAPLACE when it is ready.
    // $.defineSym(LCM);
    // $.defineSym(LCO);
    // $.defineSym(LEADING);
    // $.defineSym(LEGENDRE);
    // $.defineSym(LOG);
    // $.defineSym(LOOKUP);
    // $.defineSym(MOD);
    // $.defineSym(MULTIPLY);
    // $.defineSym(NOT);
    // $.defineSym(NROOTS);
    // $.defineSym(NUMBER);
    // $.defineSym(NUMERATOR);
    // $.defineSym(OPERATOR);
    // $.defineSym(OR);
    // $.defineSym(OUTER);
    // $.defineSym(PATTERN);
    // $.defineSym(PATTERNSINFO);
    // $.defineSym(POLAR);
    // $.defineSym(POWER);
    // $.defineSym(PRIME);
    // $.defineSym(PRINT);
    // $.defineSym(PRINT2DASCII);
    // $.defineSym(PRINTFULL);
    // $.defineSym(PRINTLATEX);
    // $.defineSym(PRINTLIST);
    // $.defineSym(PRINTPLAIN);
    // $.defineSym(PRINT_LEAVE_E_ALONE);
    // $.defineSym(PRINT_LEAVE_X_ALONE);
    // $.defineSym(PRODUCT);
    // $.defineSym(QUOTE);
    // $.defineSym(QUOTIENT);
    // $.defineSym(RANK);
    // $.defineSym(RATIONALIZE);
    // $.defineSym(RCO);
    // $.defineSym(REAL);
    // $.defineSym(YYRECT);
    // $.defineSym(ROOTS);
    // $.defineSym(ROUND);
    // $.defineSym(LANG_ASSIGN);
    // $.defineSym(SGN);
    // $.defineSym(SILENTPATTERN);
    // $.defineSym(SIMPLIFY);
    // $.defineSym(SIN);
    // $.defineSym(SINH);
    // $.defineSym(SHAPE);
    // $.defineSym(SQRT);
    // $.defineSym(STOP);
    // $.defineSym(SUBST);
    // $.defineSym(SUBTRACT);
    // $.defineSym(SUM);
    // $.defineSym(SYMBOLSINFO);
    // $.defineSym(TAN);
    // $.defineSym(TANH);
    // $.defineSym(TAYLOR);
    // $.defineSym(TEST);
    // $.defineSym(TESTEQ);
    // $.defineSym(TESTGE);
    // $.defineSym(TESTGT);
    // $.defineSym(TESTLE);
    // $.defineSym(TESTLT);
    // $.defineSym(TRANSPOSE);
    // $.defineSym(UNIT);
    // $.defineSym(UOM);
    // $.defineSym(ZERO);
}

export function define_special_symbols($: ExtensionEnv): void {
    // console.lg('define_special_symbols');

    $.beginSpecial();

    // $.defineSym(AUTOEXPAND);
    // $.defineSym(BAKE);
    // $.defineSym(ASSUME_REAL_VARIABLES);

    // $.defineSym(LAST);

    // $.defineSym(LAST_PRINT);
    // $.defineSym(LAST_2DASCII_PRINT);
    // $.defineSym(LAST_COMPUTER_PRINT);
    // $.defineSym(LAST_LATEX_PRINT);
    // $.defineSym(LAST_LIST_PRINT);
    // $.defineSym(LAST_HUMAN_PRINT);

    // $.defineSym(TRACE);

    // $.defineSym(FORCE_FIXED_PRINTOUT);
    // $.defineSym(MAX_FIXED_PRINTOUT_DIGITS);

    // $.defineSym(DRAWX); // special purpose internal symbols
    // $.defineSym(METAB);
    // $.defineSym(METAX);
    // $.defineSym(SECRETX);

    // $.defineSym(VERSION);

    // $.defineSym(PI);

    // Not sure why these aren't defined to be user symbols?
    // $.defineSym(SYMBOL_I);
    // $.defineSym(SYMBOL_IDENTITY_MATRIX);

    $.endSpecial();

    // TODO: Figure out confusion regarding the symbols below.
    // $.defineSym(SYMBOL_A);
    // $.defineSym(SYMBOL_B);
    // $.defineSym(SYMBOL_C);
    // $.defineSym(SYMBOL_D);
    // $.defineSym(SYMBOL_J);
    // $.defineSym(SYMBOL_N);
    // $.defineSym(SYMBOL_R);
    // $.defineSym(SYMBOL_S);
    // $.defineSym(SYMBOL_T);
    // $.defineSym(SYMBOL_X);
    // $.defineSym(SYMBOL_Y);
    // $.defineSym(SYMBOL_Z);

    // $.defineSym(SYMBOL_A_UNDERSCORE);
    // $.defineSym(SYMBOL_B_UNDERSCORE);
    // $.defineSym(SYMBOL_X_UNDERSCORE);

    // $.defineSym(C1);
    // $.defineSym(C2);
    // $.defineSym(C3);
    // $.defineSym(C4);
    // $.defineSym(C5);
    // $.defineSym(C6);
}

export function execute_definitions(options: SymEngineOptions | undefined, $: ExtensionEnv): void {
    // console.lg('execute_definitions()');
    if (options && options.useDefinitions) {
        const originalCodeGen = defs.codeGen;
        defs.codeGen = false;
        try {
            for (let i = 0; i < defn_strings.length; i++) {
                const defn_string = defn_strings[i];
                const [scanned, tree] = scan(defn_string, { useCaretForExponentiation: $.useCaretForExponentiation });
                try {
                    if (scanned > 0) {
                        $.valueOf(tree);
                    }
                }
                catch (e) {
                    if (e instanceof Error) {
                        throw new Error(`Unable to compute the value of definition ${JSON.stringify(defn_string)}. Cause: ${e.message}. Stack: ${e.stack}`);
                    }
                    else {
                        throw new Error(`Unable to compute the value of definition ${JSON.stringify(defn_string)}. Cause: ${e}`);
                    }
                }
            }
        }
        finally {
            // restore the symbol dependencies as they were before.
            defs.codeGen = originalCodeGen;
        }
    }
}
