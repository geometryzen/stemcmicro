import { Extension, ExtensionEnv, Sign, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { to_infix_string } from "../../print/to_infix_string";
import { cons, Cons, is_cons, is_nil, nil, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
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
    isKind(expr: U): expr is Cons {
        if (is_cons(expr)) {
            return true;
        }
        else {
            return false;
        }
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
    evaluate(expr: Cons, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return this.transform(cons(expr, argList), $);
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
    }
}
/*
function Eval_binding(expr: Cons, $: ExtensionEnv) {
    const argList = expr.argList;
    if (is_cons(argList)) {
        const sym = argList.car;
        if (is_sym(sym)) {
            stack_push($.getSymbolValue(sym));
        }
        else {
            // stack_push(new Error(`expr.argList.car MUST be a Sym. binding(expr => ${$.toInfixString(expr)})`));
        }
    }
    else {
        // stack_push(new Error(`expr.argList MUST be a Cons. binding(expr => ${$.toInfixString(expr)})`));
    }
}
*/
/*
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
*/
/*
function Eval_invg(p1: U, $: ExtensionEnv): void {
    const arg = $.valueOf(cadr(p1));
    stack_push(invg(arg, $));
}
*/
/*
function Eval_isinteger(p1: U, $: ExtensionEnv) {
    p1 = $.valueOf(cadr(p1));
    const result = _isinteger(p1);
    stack_push(result);
}
*/
/*
function _isinteger(p1: U): U {
    if (is_rat(p1)) {
        return is_rat_and_integer(p1) ? one : zero;
    }
    if (is_flt(p1)) {
        const n = Math.floor(p1.d);
        return n === p1.d ? one : zero;
    }
    return items_to_cons(ISINTEGER), p1;
}
*/
/*
function Eval_operator(p1: U, $: ExtensionEnv) {
    const mapped = is_cons(p1) ? p1.tail().map($.valueOf) : [];
    const result = items_to_cons(OPERATOR, ...mapped);
    stack_push(result);
}
*/
/*
function Eval_stop() {
    throw new Error('user stop');
}
*/

export const cons_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new ConsExtension($);
});
