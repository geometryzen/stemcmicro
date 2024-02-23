/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Atom, Cons, is_atom, nil, U } from "math-expression-tree";
import { diagnostic, Diagnostics } from "../diagnostics/diagnostics";
import { hash_for_atom } from "../hashing/hash_info";
import { wrap_as_transform } from "../operators/wrap_as_transform";
import { ProgrammingError } from "../programming/ProgrammingError";
import { Extension, ExtensionEnv } from "./ExtensionEnv";

export class UnknownAtomExtension<A extends Atom> implements Extension<A> {
    constructor(readonly atom: A) {
    }
    get hash(): string {
        // We are not installed so this will not be called anyway.
        return hash_for_atom(this.atom);
    }
    get name(): string {
        // We are not installed so this will not be called anyway.
        return this.atom.type;
    }
    iscons(): this is Extension<Cons> {
        // We are not installed so this will not be called anyway.
        return false;
    }
    operator(): never {
        // We are not installed so this will not be called anyway.
        throw new ProgrammingError();
    }
    isKind(expr: U): boolean {
        // We are not installed so this will not be called anyway.
        if (is_atom(expr)) {
            return expr.type === this.atom.type;
        }
        else {
            return false;
        }
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
        const newExpr = this.valueOf(atom, $);
        return wrap_as_transform(newExpr, atom);
    }
    valueOf(atom: A, $: ExtensionEnv): U {
        // eslint-disable-next-line no-console
        console.log(`Unknown atom of type '${atom.type}'. Consider registering an extension for this type.`);
        return atom;
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
        return false;
    }
}