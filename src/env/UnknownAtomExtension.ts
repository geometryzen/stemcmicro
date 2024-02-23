/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Atom, Cons, nil, U } from "math-expression-tree";
import { diagnostic, Diagnostics } from "../diagnostics/diagnostics";
import { Extension, ExtensionEnv, FEATURE, TFLAG_NONE } from "./ExtensionEnv";

export class UnknownAtomExtension<A extends Atom> implements Extension<A> {
    constructor(atom: A) {

    }
    get hash(): string {
        throw new Error("hash method not implemented.");
    }
    get name(): string {
        throw new Error("name method not implemented.");
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    iscons(): this is Extension<Cons> {
        throw new Error("iscons method not implemented.");
    }
    operator(): Sym {
        throw new Error("operator method not implemented.");
    }
    isKind(expr: U, $: ExtensionEnv): boolean {
        throw new Error("isKind method not implemented.");
    }
    toHumanString(expr: A, $: ExprContext): string {
        throw new Error("toHumanString method not implemented.");
    }
    toInfixString(expr: A, $: ExprContext): string {
        throw new Error("toInfixString method not implemented.");
    }
    toLatexString(expr: A, $: ExprContext): string {
        throw new Error("toLatexString method not implemented.");
    }
    toListString(expr: A, $: ExprContext): string {
        throw new Error("toListString method not implemented.");
    }
    evaluate(opr: A, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("evaluate method not implemented.");
    }
    transform(atom: A, $: ExtensionEnv): [number, U] {
        // eslint-disable-next-line no-console
        console.log(`UnknownAtomExtension.transform ${atom}`);
        // We'll assume that the atom has no internal structure.
        return [TFLAG_NONE, atom];
    }
    valueOf(expr: A, $: ExtensionEnv): U {
        throw new Error("valueOf method not implemented.");
    }
    binL(lhs: A, opr: Sym, rhs: U, env: ExprContext): U {
        // eslint-disable-next-line no-console
        console.log(`UnknownAtomExtension.binL lhs => ${lhs} opr => ${opr} rhs => ${rhs}`);
        // We'll not participate in operator overloading.
        return nil;
    }
    binR(rhs: A, opr: Sym, lhs: U, env: ExprContext): U {
        // eslint-disable-next-line no-console
        console.log(`UnknownAtomExtension.binR rhs => ${rhs} opr => ${opr} lhs => ${lhs}`);
        // We'll not participate in operator overloading.
        return nil;
    }
    dispatch(target: A, opr: Sym, argList: Cons, env: ExprContext): U {
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    subst(expr: A, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("subst method not implemented.");
    }
    test(expr: A, opr: Sym, env: ExprContext): boolean {
        throw new Error("test method not implemented.");
    }
}