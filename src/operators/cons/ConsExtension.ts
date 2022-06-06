import { Eval_approxratio } from "../../approxratio";
import { Eval_arccosh } from "../../arccosh";
import { Eval_arctanh } from "../../arctanh";
import { Eval_besselj } from "../../besselj";
import { Eval_bessely } from "../../bessely";
import { Eval_binomial } from "../../binomial";
import { Eval_choose } from "../../choose";
import { Eval_circexp } from "../../circexp";
import { Eval_clear, Eval_clearall } from "../../clear";
import { Eval_coeff } from "../../coeff";
import { Eval_cosh } from "../../cosh";
import { Eval_decomp } from "../../decomp";
import { Eval_degree } from "../../degree";
import { Eval_dirac } from "../../dirac";
import { divisors } from "../../divisors";
import { Eval_eigen, Eval_eigenval, Eval_eigenvec } from "../../eigen";
import { Extension, ExtensionEnv, Sign, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Eval_erf } from "../../erf";
import { Eval_erfc } from "../../erfc";
import { Eval_expand } from "../../expand";
import { Eval_expcos } from "../../expcos";
import { Eval_expsin } from "../../expsin";
import { Eval_factor } from "../../factor";
import { factorial } from "../../factorial";
import { Eval_filter } from "../../filter";
import { Eval_for } from "../../for";
import { Eval_gamma } from "../../gamma";
import { Eval_gcd } from "../../gcd";
import { hermite } from "../../hermite";
import { Eval_imag } from "../../imag";
import { invg } from "../../inv";
import { Eval_isprime } from "../../isprime";
import { is_rat_integer } from "../../is_rat_integer";
import { Eval_laguerre } from "../../laguerre";
import { Eval_lcm } from "../../lcm";
import { Eval_leading } from "../../leading";
import { Eval_legendre } from "../../legendre";
import { Eval_log } from "../../log";
import { Eval_lookup } from "../../lookup";
import { makeList } from "../../makeList";
import { Eval_mod } from "../../mod";
import { Eval_nroots } from "../../nroots";
import { Eval_prime } from "../../prime";
import { Eval_print, Eval_print2dascii, Eval_printcomputer, Eval_printhuman, Eval_printlatex, Eval_printlist } from "../../print/print";
import { to_infix_string } from "../../print/to_infix_string";
import { Eval_product } from "../../product";
import { Eval_quotient } from "../../quotient";
import { APPROXRATIO, ARCCOS, ARCCOSH, ARCTANH, ASSIGN, BESSELJ, BESSELY, BINDING, BINOMIAL, CHECK, CHOOSE, CIRCEXP, CLEAR, CLEARALL, CLEARPATTERNS, COEFF, COSH, DECOMP, DEGREE, DIM, DIRAC, DIVISORS, DO, EIGEN, EIGENVAL, EIGENVEC, EQUAL, ERF, ERFC, EVAL, EXPAND, EXPCOS, EXPSIN, FACTOR, FACTORIAL, FACTORPOLY, FILTER, FOR, GAMMA, GCD, HERMITE, IF, IMAG, INVG, ISINTEGER, ISPRIME, LAGUERRE, LCM, LEADING, LEGENDRE, LOG, LOOKUP, MOD, MULTIPLY, NROOTS, OPERATOR, PATTERN, PATTERNSINFO, PRIME, PRINT, PRINT2DASCII, PRINTFULL, PRINTLATEX, PRINTLIST, PRINTPLAIN, PRODUCT, QUOTIENT, RANK, SGN, SILENTPATTERN, STOP, SUBST, SUM, SYMBOLSINFO, TANH, TAYLOR, TEST, TESTEQ, TESTGE, TESTGT, TESTLE, TESTLT, TRANSPOSE, UNIT, ZERO } from "../../runtime/constants";
import { MATH_POW } from "../../runtime/ns_math";
import { stack_pop, stack_push } from "../../runtime/stack";
import { evaluate_integer } from "../../scripting/evaluate_integer";
import { Eval_arccos } from "../../scripting/eval_arccos";
import { Eval_if } from "../../scripting/eval_if";
import { Eval_clearpatterns, Eval_pattern, Eval_patternsinfo, Eval_silentpattern } from "../../scripting/eval_pattern";
import { Eval_power } from "../../scripting/eval_power";
import { Eval_symbolsinfo } from "../../scripting/eval_symbolsinfo";
import { isZeroLikeOrNonZeroLikeOrUndetermined } from "../../scripting/isZeroLikeOrNonZeroLikeOrUndetermined";
import { Eval_sgn } from "../../sgn";
import { subst } from "../../subst";
import { Eval_sum } from "../../sum";
import { Eval_tanh } from "../../tanh";
import { Eval_taylor } from "../../taylor";
import { Eval_test, Eval_testeq, Eval_testge, Eval_testgt, Eval_testle, Eval_testlt } from "../../test";
import { Eval_transpose } from "../../transpose";
import { Err } from "../../tree/err/Err";
import { cadddr, caddr, cadr, cddr } from "../../tree/helpers";
import { one, wrap_as_int, zero } from "../../tree/rat/Rat";
import { create_tensor_elements_diagonal } from "../../tree/tensor/create_tensor_elements";
import { Tensor } from "../../tree/tensor/Tensor";
import { car, cdr, Cons, is_cons, is_nil, nil, U } from "../../tree/tree";
import { Eval_zero } from "../../zero";
import { is_flt } from "../flt/is_flt";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";
import { is_tensor } from "../tensor/is_tensor";

/**
 * Cons, like Sym is actually fundamental to the tree (not an Extension).
 * However, this is defined so that extensions can define operators with Cons.
 * e.g. Defining operator * (Tensor, Cons) would allow Cons expressions to multiply Tensor elements.
 * TODO: It may be possible to register this as an Extension, but we don't do it for now.
 * There may be some advantages in registering it as an extension. e.g. We could explicitly
 * define where Cons appears when sorting elements. Also, less special-case code for Cons. 
 */
class ConsExtension implements Extension<Cons> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return 'Cons';
    }
    get hash(): string {
        return 'Cons';
    }
    get name(): string {
        return 'ConsExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFactors(lhs: Cons, rhs: Cons, $: ExtensionEnv): Sign {
        throw new Error("Cons Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Cons, $: ExtensionEnv): boolean {
        return false;
    }
    isKind(expr: U): expr is Cons {
        if (is_cons(expr)) {
            return true;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(arg: Cons, $: ExtensionEnv): boolean {
        // The answer would be false if we give up.
        throw new Error("Cons Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(arg: Cons, $: ExtensionEnv): boolean {
        throw new Error("Cons Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Cons, $: ExtensionEnv): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Cons, $: ExtensionEnv): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Cons, $: ExtensionEnv): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(arg: Cons, $: ExtensionEnv): boolean {
        throw new Error("Cons Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Cons, $: ExtensionEnv): Cons {
        // Cons does not have a zero value.
        throw new Error();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Cons, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        throw new Error(`expr = ${expr} oldExpr = ${oldExpr} newExpr = ${newExpr}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(cons: Cons, $: ExtensionEnv): string {
        return to_infix_string(cons, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(cons: Cons, $: ExtensionEnv): string {
        return to_infix_string(cons, $);
    }
    toListString(cons: Cons, $: ExtensionEnv): string {
        let str = '';
        str += '(';
        str += $.toSExprString(cons.car);
        let expr = cons.cdr;
        while (is_cons(expr)) {
            str += ' ';
            str += $.toSExprString(expr.car);
            expr = expr.cdr;
        }
        if (expr !== nil) {
            str += ' . ';
            str += $.toSExprString(expr);
        }
        str += ')';
        return str;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // console.log(`ConsExtension.transform ${expr}`);
        return [TFLAG_NONE, expr];
    }
    valueOf(expr: Cons, $: ExtensionEnv): U {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hook = function (retval: U, description: string): U {
            // console.lg(`ConsExtension.valueOf expr => ${expr} @ ${description}`);
            return retval;
        };
        /**
         * The car of the expression is the symbol for the operator.
         */
        const op = expr.car;

        // If we didn't fall in the EVAL case above
        // then at this point we must have a symbol, or maybe a list containing stuff that does not have a symbol
        // in the operator position.
        if (!is_sym(op)) {
            const operator = $.operatorFor(op);
            if (is_nil(expr.cdr)) {
                // We are being asked to evaluate a list containing a single item.
                // That's just the evaluation of the item.
                return hook(operator.valueOf(op), "B");
            }
            else {
                return hook(expr, "C");
            }
        }
        else {
            return expr;
        }
        /*
        if (MATH_ADD.contains(op)) {
            return expr;
        }
        */

        // TODO: This switch will fail because Sym is no longer interred.
        switch (op) {
            case ARCCOS: {
                Eval_arccos(expr, $);
                return stack_pop();
            }
            case ARCCOSH:
                Eval_arccosh(expr, $);
                return stack_pop();
            case ARCTANH:
                Eval_arctanh(expr, $);
                return stack_pop();
                // case ATOMIZE: Eval_atomize();
                return stack_pop();
            case BESSELJ:
                Eval_besselj(expr, $);
                return stack_pop();
            case BESSELY:
                Eval_bessely(expr, $);
                return stack_pop();
            case BINDING:
                Eval_binding(expr, $);
                return stack_pop();
            case BINOMIAL:
                Eval_binomial(expr, $);
                return stack_pop();
            case CHECK:
                Eval_check(expr, $);
                return stack_pop();
            case CHOOSE:
                Eval_choose(expr, $);
                return stack_pop();
            case CIRCEXP:
                Eval_circexp(expr, $);
                return stack_pop();
            case CLEAR:
                Eval_clear(expr, $);
                return stack_pop();
            case CLEARALL: {
                Eval_clearall($);
                return stack_pop();
            }
            case CLEARPATTERNS:
                Eval_clearpatterns();
                return stack_pop();
            case COEFF:
                Eval_coeff(expr, $);
                return stack_pop();
            case COSH:
                Eval_cosh(expr, $);
                return stack_pop();
            case DECOMP:
                Eval_decomp(expr, $);
                return stack_pop();
            case DEGREE:
                Eval_degree(expr, $);
                return stack_pop();
            case DIM:
                Eval_dim(expr, $);
                return stack_pop();
            case DIRAC:
                Eval_dirac(expr, $);
                return stack_pop();
            case DIVISORS:
                Eval_divisors(expr, $);
                return stack_pop();
            case DO:
                Eval_do(expr, $);
                return stack_pop();
                // case DRAW: Eval_draw();
                return stack_pop();
                // case DSOLVE: Eval_dsolve();
                return stack_pop();
            case EIGEN:
                Eval_eigen(expr, $);
                return stack_pop();
            case EIGENVAL:
                Eval_eigenval(expr, $);
                return stack_pop();
            case EIGENVEC:
                Eval_eigenvec(expr, $);
                return stack_pop();
            case EQUAL:
                throw new Error(`Unsupported ${EQUAL}`);
            case ERF:
                Eval_erf(expr, $);
                return stack_pop();
            case ERFC:
                Eval_erfc(expr, $);
                return stack_pop();
            case EVAL:
                Eval_Eval(expr, $);
                return stack_pop();
            case EXPAND:
                Eval_expand(expr, $);
                return stack_pop();
            case EXPCOS:
                Eval_expcos(expr, $);
                return stack_pop();
            case EXPSIN:
                Eval_expsin(expr, $);
                return stack_pop();
            case FACTOR:
                Eval_factor(expr, $);
                return stack_pop();
            case FACTORIAL:
                Eval_factorial(expr, $);
                return stack_pop();
            case FACTORPOLY:
                Eval_factorpoly(expr, $);
                return stack_pop();
            case FILTER:
                Eval_filter(expr, $);
                return stack_pop();
            case APPROXRATIO:
                Eval_approxratio(expr, $);
                return stack_pop();
            case FOR:
                Eval_for(expr, $);
                return stack_pop();
            case GAMMA:
                Eval_gamma(expr, $);
                return stack_pop();
            case GCD:
                Eval_gcd(expr, $);
                return stack_pop();
            case HERMITE:
                Eval_hermite(expr, $);
                return stack_pop();
            case IF:
                Eval_if(expr, $);
                return stack_pop();
            case IMAG:
                Eval_imag(expr, $);
                return stack_pop();
            case INVG:
                Eval_invg(expr, $);
                return stack_pop();
            case ISINTEGER:
                Eval_isinteger(expr, $);
                return stack_pop();
            case ISPRIME:
                Eval_isprime(expr, $);
                return stack_pop();
            case LAGUERRE:
                Eval_laguerre(expr, $);
                return stack_pop();
            //  when LAPLACE then Eval_laplace()
            case LCM:
                Eval_lcm(expr, $);
                return stack_pop();
            case LEADING:
                Eval_leading(expr, $);
                return stack_pop();
            case LEGENDRE:
                Eval_legendre(expr, $);
                return stack_pop();
            case LOG:
                Eval_log(expr, $);
                return stack_pop();
            case LOOKUP:
                Eval_lookup(expr, $);
                return stack_pop();
            case MOD:
                Eval_mod(expr, $);
                return stack_pop();
            case MULTIPLY: {
                // This should be done by the math_mul extension.
                throw new Error();
                // Eval_multiply(expr, $);
                // return pop();
            }
            case NROOTS:
                Eval_nroots(expr, $);
                return stack_pop();
            case OPERATOR:
                Eval_operator(expr, $);
                return stack_pop();
            case PATTERN:
                Eval_pattern(expr, $);
                return stack_pop();
            case PATTERNSINFO:
                Eval_patternsinfo();
                return stack_pop();
            case MATH_POW:
                Eval_power(expr, $);
                return stack_pop();
            case PRIME:
                Eval_prime(expr, $);
                return stack_pop();
            case PRINT:
                Eval_print(expr, $);
                return stack_pop();
            case PRINT2DASCII:
                Eval_print2dascii(expr, $);
                return stack_pop();
            case PRINTFULL:
                Eval_printcomputer(expr, $);
                return stack_pop();
            case PRINTLATEX:
                Eval_printlatex(expr, $);
                return stack_pop();
            case PRINTLIST:
                Eval_printlist(expr, $);
                return stack_pop();
            case PRINTPLAIN:
                Eval_printhuman(expr, $);
                return stack_pop();
            case PRODUCT:
                Eval_product(expr, $);
                return stack_pop();
            case QUOTIENT:
                Eval_quotient(expr, $);
                return stack_pop();
            case RANK:
                Eval_rank(expr, $);
                return stack_pop();
            case SGN:
                Eval_sgn(expr, $);
                return stack_pop();
            case SILENTPATTERN:
                Eval_silentpattern(expr, $);
                return stack_pop();
            case STOP:
                Eval_stop();
                return stack_pop();
            case SUBST:
                Eval_subst(expr, $);
                return stack_pop();
            case SUM:
                Eval_sum(expr, $);
                return stack_pop();
            case SYMBOLSINFO:
                Eval_symbolsinfo($);
                return stack_pop();
            case TANH:
                Eval_tanh(expr, $);
                return stack_pop();
            case TAYLOR:
                Eval_taylor(expr, $);
                return stack_pop();
            case TEST:
                Eval_test(expr, $);
                return stack_pop();
            case TESTEQ:
                Eval_testeq(expr, $);
                return stack_pop();
            case TESTGE:
                Eval_testge(expr, $);
                return stack_pop();
            case TESTGT:
                Eval_testgt(expr, $);
                return stack_pop();
            case TESTLE:
                Eval_testle(expr, $);
                return stack_pop();
            case TESTLT:
                Eval_testlt(expr, $);
                return stack_pop();
            case TRANSPOSE:
                Eval_transpose(expr, $);
                return stack_pop();
            case UNIT:
                Eval_unit(expr, $);
                return stack_pop();
            case ZERO:
                Eval_zero(expr, $);
                return stack_pop();
            default:
                throw new Error();
        }

        throw new Error(`ConsExtension.valueOf ${$.toInfixString(expr)} method not implemented.`);
        return expr;
    }
}

function Eval_binding(expr: Cons, $: ExtensionEnv) {
    const argList = expr.argList;
    if (is_cons(argList)) {
        const sym = argList.car;
        if (is_sym(sym)) {
            stack_push($.getBinding(sym));
        }
        else {
            stack_push(new Err(`expr.argList.car MUST be a Sym. binding(expr => ${$.toInfixString(expr)})`));
        }
    }
    else {
        stack_push(new Err(`expr.argList MUST be a Cons. binding(expr => ${$.toInfixString(expr)})`));
    }
}

/* check =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
p
 
General description
-------------------
Returns whether the predicate p is true/false or unknown:
0 if false, 1 if true or remains unevaluated if unknown.
Note that if "check" is passed an assignment, it turns it into a test,
i.e. check(a = b) is turned into check(a==b) 
so "a" is not assigned anything.
Like in many programming languages, "check" also gives truthyness/falsyness
for numeric values. In which case, "true" is returned for non-zero values.
Potential improvements: "check" can't evaluate strings yet.
 
*/
function Eval_check(p1: U, $: ExtensionEnv) {
    // check the argument
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(p1), $);

    if (checkResult == null) {
        // returned null: unknown result
        // leave the whole check unevalled
        stack_push(p1);
    }
    else {
        // returned true or false -> 1 or 0
        stack_push(wrap_as_int(Number(checkResult)));
    }
}

/* dim =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
m,n
 
General description
-------------------
Returns the cardinality of the nth index of tensor "m".
 
*/
function Eval_dim(p1: U, $: ExtensionEnv) {
    //int n
    const p2 = $.valueOf(cadr(p1));
    const n = is_cons(cddr(p1)) ? evaluate_integer(caddr(p1), $) : 1;
    if (!is_tensor(p2)) {
        stack_push(one); // dim of scalar is 1
    }
    else if (n < 1 || n > p2.ndim) {
        stack_push(p1);
    }
    else {
        stack_push(wrap_as_int(p2.dim(n - 1)));
    }
}

function Eval_divisors(p1: U, $: ExtensionEnv) {
    stack_push(divisors($.valueOf(cadr(p1)), $));
}

/* do =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
a,b,...
 
General description
-------------------
Evaluates each argument from left to right. Returns the result of the last argument.
 
*/
function Eval_do(p1: U, $: ExtensionEnv) {
    stack_push(car(p1));
    p1 = cdr(p1);

    while (is_cons(p1)) {
        stack_pop();
        stack_push($.valueOf(car(p1)));
        p1 = cdr(p1);
    }
}

/*
function Eval_dsolve(p1: U) {
  push(Eval(cadr(p1)));
  push(Eval(caddr(p1)));
  push(Eval(cadddr(p1)));
  throw new Error('dsolve');
  //dsolve();
}
*/

// for example, Eval(f,x,2)

function Eval_Eval(p1: U, $: ExtensionEnv) {
    let tmp = $.valueOf(cadr(p1));
    p1 = cddr(p1);
    while (is_cons(p1)) {
        tmp = subst(tmp, $.valueOf(car(p1)), $.valueOf(cadr(p1)), $);
        p1 = cddr(p1);
    }
    stack_push($.valueOf(tmp));
}

function Eval_factorial(p1: U, $: ExtensionEnv) {
    stack_push(factorial($.valueOf(cadr(p1))));
}

function Eval_factorpoly(p1: U, $: ExtensionEnv) {
    p1 = cdr(p1);
    const arg1 = $.valueOf(car(p1));
    p1 = cdr(p1);
    const arg2 = $.valueOf(car(p1));
    let temp = $.factorize(arg1, arg2);
    if (is_cons(p1)) {
        temp = p1.tail().reduce((a: U, b: U) => $.factorize(a, $.valueOf(b)), temp);
    }
    stack_push(temp);
}

function Eval_hermite(p1: U, $: ExtensionEnv) {
    const arg2 = $.valueOf(caddr(p1));
    const arg1 = $.valueOf(cadr(p1));
    stack_push(hermite(arg1, arg2, $));
}

function Eval_invg(p1: U, $: ExtensionEnv): void {
    const arg = $.valueOf(cadr(p1));
    stack_push(invg(arg, $));
}

function Eval_isinteger(p1: U, $: ExtensionEnv) {
    p1 = $.valueOf(cadr(p1));
    const result = _isinteger(p1);
    stack_push(result);
}

function _isinteger(p1: U): U {
    if (is_rat(p1)) {
        return is_rat_integer(p1) ? one : zero;
    }
    if (is_flt(p1)) {
        const n = Math.floor(p1.d);
        return n === p1.d ? one : zero;
    }
    return makeList(ISINTEGER), p1;
}

function Eval_operator(p1: U, $: ExtensionEnv) {
    const mapped = is_cons(p1) ? p1.tail().map($.valueOf) : [];
    const result = makeList(OPERATOR, ...mapped);
    stack_push(result);
}

// rank definition
function Eval_rank(p1: U, $: ExtensionEnv) {
    p1 = $.valueOf(cadr(p1));
    const rank = is_tensor(p1) ? wrap_as_int(p1.ndim) : zero;
    stack_push(rank);
}


function Eval_stop() {
    throw new Error('user stop');
}

function Eval_subst(p1: Cons, $: ExtensionEnv): void {
    const newExpr = $.valueOf(cadr(p1));
    const oldExpr = $.valueOf(caddr(p1));
    const expr = $.valueOf(cadddr(p1));
    stack_push($.valueOf(subst(expr, oldExpr, newExpr, $)));
}

// always returns a matrix with rank 2
// i.e. two dimensions,
// the passed parameter is the size
function Eval_unit(expr: U, $: ExtensionEnv) {
    const n = evaluate_integer(cadr(expr), $);

    if (isNaN(n)) {
        stack_push(expr);
        return;
    }

    if (n < 1) {
        stack_push(expr);
        return;
    }

    const sizes = [n, n];
    const elems = create_tensor_elements_diagonal(n, one, zero);
    const I = new Tensor(sizes, elems);

    stack_push(I);
}

// like Eval() except "=" (assignment) is treated
// as "==" (equality test)
// This is because
//  * this allows users to be lazy and just
//    use "=" instead of "==" as per more common
//    mathematical notation
//  * in many places we don't expect an assignment
//    e.g. we don't expect to test the zero-ness
//    of an assignment or the truth value of
//    an assignment
// Note that these are questionable assumptions
// as for example in most programming languages one
// can indeed test the value of an assignment (the
// value is just the evaluation of the right side)

export function Eval_predicate(p1: U, $: ExtensionEnv): U {
    if (car(p1).equals(ASSIGN)) {
        // replace the assignment in the
        // head with an equality test
        p1 = makeList(TESTEQ), cadr(p1), caddr(p1);
    }

    return $.valueOf(p1);
}

export const cons = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new ConsExtension($);
});
