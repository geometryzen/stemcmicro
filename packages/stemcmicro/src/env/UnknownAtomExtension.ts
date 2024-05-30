/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Atom, Cons, is_atom, nil, U } from "@stemcmicro/tree";
import { diagnostic } from "../diagnostics/diagnostics";
import { Diagnostics } from "../diagnostics/messages";
import { hash_for_atom } from "../hashing/hash_info";
import { wrap_as_transform } from "../operators/wrap_as_transform";
import { ProgrammingError } from "../programming/ProgrammingError";
import { Extension, ExtensionEnv } from "./ExtensionEnv";

export class UnknownAtomExtension<A extends Atom> implements Extension<A> {
    constructor(readonly atom: A) {}
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
        } else {
            return false;
        }
    }
    toHumanString(atom: A, $: ExprContext): string {
        return `${atom}`;
    }
    toInfixString(atom: A, $: ExprContext): string {
        return `${atom}`;
    }
    toLatexString(atom: A, $: ExprContext): string {
        return `${atom}`;
    }
    toListString(atom: A, $: ExprContext): string {
        return `${atom}`;
    }
    evaluate(opr: A, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("evaluate method not implemented.");
    }
    transform(atom: A, $: ExtensionEnv): [number, U] {
        const newExpr = this.valueOf(atom, $);
        return wrap_as_transform(newExpr, atom);
    }
    valueOf(atom: A, $: ExprContext): U {
        return atom;
    }
    binL(lhs: A, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    binR(rhs: A, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    dispatch(target: A, opr: Sym, argList: Cons, env: ExprContext): U {
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    subst(atom: A, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        return atom;
    }
    test(expr: A, opr: Sym, env: ExprContext): boolean {
        return false;
    }
}
