/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, nil, U } from "@stemcmicro/tree";
import { diagnostic } from "../../diagnostics/diagnostics";
import { is_localizable, Localizable } from "../../diagnostics/localizable";
import { Diagnostics } from "../../diagnostics/messages";
import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, mkbuilder } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { nativeStr } from "../../nativeInt";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { create_str } from "../str/create_str";

const greeting = new Localizable(Diagnostics.Hello_World, nil);

export function formatStringFromArgs(text: string, argList: Cons, env: ExprContext): string {
    return text.replace(/{(\d+)}/g, (_match, index: string) => {
        const arg = argList.item(parseInt(index));
        try {
            const handler = env.handlerFor(arg);
            const value = handler.dispatch(arg, native_sym(Native.infix), nil, env);
            try {
                return nativeStr(value);
            } finally {
                value.release();
            }
        } finally {
            arg.release();
        }
    });
}

export class LocalizableExtension implements Extension<Localizable> {
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    readonly #hash = hash_for_atom(greeting);
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return "RatExtension";
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    isKind(expr: U, $: ExtensionEnv): boolean {
        return is_localizable(expr);
    }
    toHumanString(expr: Localizable, $: ExprContext): string {
        const diagmsg = expr.message;
        const text = diagmsg.text;
        const argList = expr.argList;
        try {
            return formatStringFromArgs(text, argList, $);
        } finally {
            argList.release();
        }
    }
    toInfixString(expr: Localizable, $: ExprContext): string {
        const diagmsg = expr.message;
        const text = diagmsg.text;
        const argList = expr.argList;
        try {
            return formatStringFromArgs(text, argList, $);
        } finally {
            argList.release();
        }
    }
    toLatexString(expr: Localizable, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toListString(expr: Localizable, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    evaluate(opr: Localizable, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    transform(expr: Localizable, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: Localizable, $: ExtensionEnv): U {
        throw new Error("Method not implemented.");
    }
    binL(lhs: Localizable, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    binR(rhs: Localizable, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    dispatch(target: Localizable, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.infix: {
                return create_str(this.toInfixString(target, env));
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    subst(expr: Localizable, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Localizable, opr: Sym, env: ExprContext): boolean {
        throw new Error("Method not implemented.");
    }
}

export const localizable_extension_builder: ExtensionBuilder<U> = mkbuilder<Localizable>(LocalizableExtension);
