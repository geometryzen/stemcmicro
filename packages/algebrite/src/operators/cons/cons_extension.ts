import { is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { cons, Cons, is_cons, is_nil, nil, U } from "@stemcmicro/tree";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, Sign, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { listform } from "../../helpers/listform";
import { to_infix_string } from "../../print/to_infix_string";

/**
 * Cons, like Sym is actually fundamental to the tree (not an Extension).
 * However, this is defined so that extensions can define operators with Cons.
 * e.g. Defining operator * (Tensor, Cons) would allow Cons expressions to multiply Tensor elements.
 * TODO: It may be possible to register this as an Extension, but we don't do it for now.
 * There may be some advantages in registering it as an extension. e.g. We could explicitly
 * define where Cons appears when sorting elements. Also, less special-case code for Cons.
 */
class ConsExtension implements Extension<Cons> {
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(expr: Cons, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error(`${this.name}.binL(${expr},${opr}) method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(expr: Cons, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error(`${this.name}.binR(${expr},${opr}) method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Cons, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Cons, opr: Sym): boolean {
        throw new Error(`${this.name}.test(${expr},${opr}) method not implemented.`);
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        // We'd like to return a Sym but we don't know it yet.
        throw new Error();
    }
    get hash(): string {
        return "Cons";
    }
    get name(): string {
        return "ConsExtension";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFactors(lhs: Cons, rhs: Cons, $: ExtensionEnv): Sign {
        throw new Error("Cons Method not implemented.");
    }
    isKind(expr: U): expr is Cons {
        if (is_cons(expr)) {
            return true;
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Cons, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        throw new Error(`expr = ${expr} oldExpr = ${oldExpr} newExpr = ${newExpr}`);
    }
    toHumanString(cons: Cons, $: ExprContext): string {
        return to_infix_string(cons, $);
    }
    toInfixString(cons: Cons, $: ExprContext): string {
        return to_infix_string(cons, $);
    }
    toLatexString(cons: Cons, $: ExprContext): string {
        return to_infix_string(cons, $);
    }
    toListString(cons: Cons, $: ExprContext): string {
        let str = "";
        str += "(";
        str += listform(cons.car, $);
        let expr = cons.cdr;
        while (is_cons(expr)) {
            str += " ";
            str += listform(expr.car, $);
            expr = expr.cdr;
        }
        if (expr !== nil) {
            str += " . ";
            str += listform(expr, $);
        }
        str += ")";
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
            const extension = $.extensionFor(op);
            if (is_nil(expr.cdr)) {
                // We are being asked to evaluate a list containing a single item.
                // That's just the evaluation of the item.
                if (extension) {
                    return hook(extension.valueOf(op, $), "A");
                } else {
                    return hook(op, "B");
                }
            } else {
                return hook(expr, "C");
            }
        } else {
            return expr;
        }
    }
}

export const cons_extension_builder = mkbuilder(ConsExtension);
