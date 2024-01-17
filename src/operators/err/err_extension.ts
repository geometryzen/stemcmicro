import { nil } from 'math-expression-tree';
import { Extension, ExtensionEnv, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Err } from "../../tree/err/Err";
import { cons, Cons, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

const ENGLISH_UNDEFINED = 'undefined';

/*
export function error_compare(lhs: Err, rhs: Err): Sign {
    const str1 = lhs.message;
    const str2 = rhs.message;
    if (str1 === str2) {
        return SIGN_EQ;
    }
    else if (str1 > str2) {
        return SIGN_GT;
    }
    else {
        return SIGN_LT;
    }
}
*/

export class ErrExtension implements Extension<Err> {
    readonly #hash = new Err(nil).name;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return 'ErrExtension';
    }
    get key(): string {
        return this.#hash;
    }
    evaluate(expr: Err, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Err ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Err, $: ExtensionEnv): U {
        throw new Error("ErrExtension.valueOf Method not implemented.");
    }
    isKind(arg: unknown): arg is Err {
        return arg instanceof Err;
    }
    subst(expr: Err, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Err, $: ExtensionEnv): string {
        return ENGLISH_UNDEFINED;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Err, $: ExtensionEnv): string {
        return ENGLISH_UNDEFINED;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Err, $: ExtensionEnv): string {
        return ENGLISH_UNDEFINED;
    }
}

export const err_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new ErrExtension($);
});