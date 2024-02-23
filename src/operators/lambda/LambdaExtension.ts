/* eslint-disable @typescript-eslint/no-unused-vars */
import { is_lambda, Lambda, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, nil, U } from "math-expression-tree";
import { Extension, ExtensionEnv, mkbuilder } from "../../env/ExtensionEnv";
import { HASH_LAMBDA } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { wrap_as_transform } from "../wrap_as_transform";

class LambdaExtension implements Extension<Lambda> {
    get hash(): string {
        return HASH_LAMBDA;
    }
    get name(): string {
        return 'LambdaExtension';
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    isKind(expr: U, $: ExtensionEnv): boolean {
        return is_lambda(expr);
    }
    toHumanString(expr: Lambda, $: ExprContext): string {
        throw new Error("LambdaExtension.toHumanString method not implemented.");
    }
    toInfixString(expr: Lambda, $: ExprContext): string {
        throw new Error("LambdaExtension.toInfixString method not implemented.");
    }
    toLatexString(expr: Lambda, $: ExprContext): string {
        throw new Error("LambdaExtension.toLatexString method not implemented.");
    }
    toListString(expr: Lambda, $: ExprContext): string {
        throw new Error("LambdaExtension.toListString method not implemented.");
    }
    evaluate(opr: Lambda, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("LambdaExtension.evaluate method not implemented.");
    }
    transform(expr: Lambda): [number, U] {
        const newExpr = this.valueOf(expr);
        try {
            return wrap_as_transform(newExpr, expr);
        }
        finally {
            newExpr.release();
        }
    }
    valueOf(expr: Lambda): U {
        return expr;
    }
    binL(lhs: Lambda, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    binR(rhs: Lambda, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    dispatch(expr: Lambda, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("LambdaExtension.dispatch method not implemented.");
    }
    subst(expr: Lambda, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("LambdaExtension.subst method not implemented.");
    }
    test(expr: Lambda, opr: Sym, env: ExprContext): boolean {
        throw new Error("LambdaExtension.test method not implemented.");
    }

}

export const lambda_extension_builder = mkbuilder(LambdaExtension);
