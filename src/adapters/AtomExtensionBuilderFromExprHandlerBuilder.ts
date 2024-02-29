/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, is_boo, Sym } from "math-expression-atoms";
import { ExprContext, ExprHandler } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Atom, Cons, is_atom, is_nil, nil, U } from "math-expression-tree";
import { ExprHandlerBuilder } from "../api/api";
import { diagnostic } from "../diagnostics/diagnostics";
import { Diagnostics } from "../diagnostics/messages";
import { EnvConfig } from "../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv } from "../env/ExtensionEnv";
import { nativeStr } from "../nativeInt";
import { wrap_as_transform } from "../operators/wrap_as_transform";
import { ProgrammingError } from "../programming/ProgrammingError";

class AtomExtensionFromExprHandler<T extends Atom> implements Extension<T> {
    readonly #type: string;
    readonly #guard: (expr: Atom) => boolean;
    constructor(readonly handler: ExprHandler<T>, type: string, guard: (expr: Atom) => boolean) {
        this.#type = type;
        this.#guard = guard;
    }
    get hash(): string {
        return this.#type;
    }
    get name(): string {
        return this.#type;
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    isKind(expr: U): boolean {
        if (is_atom(expr)) {
            return this.#guard(expr);
        }
        else {
            return false;
        }
    }
    toHumanString(expr: T, $: ExprContext): string {
        return nativeStr(this.handler.dispatch(expr, native_sym(Native.human), nil, $));
    }
    toInfixString(expr: T, $: ExprContext): string {
        return nativeStr(this.handler.dispatch(expr, native_sym(Native.infix), nil, $));
    }
    toLatexString(expr: T, $: ExprContext): string {
        return nativeStr(this.handler.dispatch(expr, native_sym(Native.latex), nil, $));
    }
    toListString(expr: T, $: ExprContext): string {
        return nativeStr(this.handler.dispatch(expr, native_sym(Native.sexpr), nil, $));
    }
    evaluate(opr: T, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("evaluate method not implemented.");
    }
    transform(expr: T, env: ExprContext): [number, U] {
        const newExpr = this.valueOf(expr, env);
        try {
            return wrap_as_transform(newExpr, expr);
        }
        finally {
            newExpr.release();
        }
    }
    valueOf(expr: T, env: ExprContext): U {
        return this.dispatch(expr, create_sym("valueof"), nil, env);
    }
    binL(lhs: T, opr: Sym, rhs: U, env: ExprContext): U {
        return this.handler.binL(lhs, opr, rhs, env);
    }
    binR(rhs: T, opr: Sym, lhs: U, env: ExprContext): U {
        return this.handler.binR(rhs, opr, lhs, env);
    }
    dispatch(target: T, opr: Sym, argList: Cons, env: ExprContext): U {
        const response = this.handler.dispatch(target, opr, argList, env);
        if (is_nil(response)) {
            return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
        }
        else {
            return response;
        }
    }
    subst(expr: T, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("subst method not implemented.");
    }
    test(expr: T, opr: Sym, env: ExprContext): boolean {
        const response = this.handler.dispatch(expr, opr, nil, env);
        if (is_boo(response)) {
            return response.isTrue();
        }
        else {
            throw diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(expr.type));
        }
    }
}

export class AtomExtensionBuilderFromExprHandlerBuilder<T extends Atom> implements ExtensionBuilder<T> {
    constructor(readonly builder: ExprHandlerBuilder<T>, readonly type: string, readonly guard: (expr: Atom) => boolean) {

    }
    create(config: Readonly<EnvConfig>): Extension<T> {
        return new AtomExtensionFromExprHandler(this.builder.create(), this.type, this.guard);
    }

}