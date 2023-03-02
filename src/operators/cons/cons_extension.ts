import { Eval_approxratio } from "../../approxratio";
import { Eval_clear } from "../../clear";
import { Extension, ExtensionEnv, Sign, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Eval_filter } from "../../filter";
import { invg } from "../../inv";
import { is_rat_integer } from "../../is_rat_integer";
import { Eval_leading } from "../../leading";
import { Eval_lookup } from "../../lookup";
import { makeList } from "../../makeList";
import { Eval_prime } from "../../prime";
import { to_infix_string } from "../../print/to_infix_string";
import { APPROXRATIO, BINDING, CHECK, CLEAR, CLEARPATTERNS, FACTORPOLY, FILTER, IF, INVG, ISINTEGER, LEADING, LOOKUP, OPERATOR, PATTERN, PATTERNSINFO, PRIME, SILENTPATTERN, STOP, SYMBOLSINFO, TEST, TESTGE, TESTGT, TESTLE } from "../../runtime/constants";
import { stack_pop, stack_push } from "../../runtime/stack";
import { Eval_if } from "../../scripting/eval_if";
import { Eval_clearpatterns, Eval_pattern, Eval_patternsinfo, Eval_silentpattern } from "../../scripting/eval_pattern";
import { Eval_symbolsinfo } from "../../scripting/eval_symbolsinfo";
import { isZeroLikeOrNonZeroLikeOrUndetermined } from "../../scripting/isZeroLikeOrNonZeroLikeOrUndetermined";
import { Eval_test, Eval_testge, Eval_testgt, Eval_testle } from "../../test";
import { Err } from "../../tree/err/Err";
import { cadr } from "../../tree/helpers";
import { one, wrap_as_int, zero } from "../../tree/rat/Rat";
import { car, cdr, Cons, is_cons, is_nil, nil, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

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
        // console.lg(`ConsExtension.transform ${expr}`);
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
            case BINDING:
                Eval_binding(expr, $);
                return stack_pop();
            case CHECK:
                Eval_check(expr, $);
                return stack_pop();
            case CLEAR:
                Eval_clear(expr, $);
                return stack_pop();
            case CLEARPATTERNS:
                Eval_clearpatterns();
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
            case IF:
                Eval_if(expr, $);
                return stack_pop();
            case INVG:
                Eval_invg(expr, $);
                return stack_pop();
            case ISINTEGER:
                Eval_isinteger(expr, $);
                return stack_pop();
            case LEADING:
                Eval_leading(expr, $);
                return stack_pop();
            case LOOKUP:
                Eval_lookup(expr, $);
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
            case PRIME:
                Eval_prime(expr, $);
                return stack_pop();
            case SILENTPATTERN:
                Eval_silentpattern(expr, $);
                return stack_pop();
            case STOP:
                Eval_stop();
                return stack_pop();
            case SYMBOLSINFO:
                Eval_symbolsinfo($);
                return stack_pop();
            case TEST:
                Eval_test(expr, $);
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

function Eval_stop() {
    throw new Error('user stop');
}

export const cons_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new ConsExtension($);
});
