/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, nil, U } from "math-expression-tree";
import { diagnostic, Diagnostics, is_localizable, Localizable } from "../../diagnostics/diagnostics";
import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, mkbuilder } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";

const greeting = new Localizable(Diagnostics.Hello_World, nil);

export function formatStringFromArgs(text: string, argList: Cons, _: ExprContext): string {
    return text.replace(/{(\d+)}/g, (_match, index: string) => {
        // TODO
        const arg = argList.item(parseInt(index));
        try {
            const handler = _.handlerFor(arg);
            return handler.toInfixString(arg, _);
        }
        finally {
            arg.release();
        }

        // 
        return text;
    }
    );
}

export class LocalizableExtension implements Extension<Localizable> {
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    readonly #hash = hash_for_atom(greeting);
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return 'RatExtension';
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
        const text = diagmsg.message;
        const argList = expr.argList;
        try {
            return formatStringFromArgs(text, argList, $);
        }
        finally {
            argList.release();
        }
    }
    toInfixString(expr: Localizable, $: ExprContext): string {
        const diagmsg = expr.message;
        const text = diagmsg.message;
        const argList = expr.argList;
        try {
            return formatStringFromArgs(text, argList, $);
        }
        finally {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Localizable, opr: Sym, argList: Cons, env: ExprContext): U {
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    subst(expr: Localizable, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Localizable, opr: Sym, env: ExprContext): boolean {
        throw new Error("Method not implemented.");
    }
}

export const localizable_extension_builder: ExtensionBuilder<U> = mkbuilder<Localizable>(LocalizableExtension);