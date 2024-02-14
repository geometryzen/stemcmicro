import { Sym } from "math-expression-atoms";
import { Atom, Cons, U } from "math-expression-tree";
import { ProgrammingError } from "../programming/ProgrammingError";
import { Extension, ExtensionEnv, Operator } from "../env/ExtensionEnv";

export class AtomOperatorFromExtension<A extends Atom> implements Operator<A> {
    constructor(readonly extension: Extension<A>, readonly $: ExtensionEnv) {
        if (!extension) {
            throw new ProgrammingError();
        }
    }
    get hash() {
        return this.extension.hash;
    }
    get name() {
        return this.extension.name;
    }
    get phases() {
        return this.extension.phases;
    }
    get dependencies() {
        return this.extension.dependencies;
    }
    operator(): Sym {
        return this.extension.operator();
    }
    iscons(): this is Operator<Cons> {
        return this.extension.iscons();
    }
    isKind(expr: U): expr is A {
        return this.extension.isKind(expr, this.$);
    }
    subst(expr: A, oldExpr: U, newExpr: U): U {
        return this.extension.subst(expr, oldExpr, newExpr, this.$);
    }
    test(expr: A, opr: Sym): boolean {
        try {
            return this.extension.test(expr, opr, this.$);
        }
        catch (e) {
            throw new ProgrammingError(`${this.extension.name} ${expr} ${opr} ${e}`);
        }
    }
    toInfixString(expr: A): string {
        return this.extension.toInfixString(expr, this.$);
    }
    toLatexString(expr: A): string {
        return this.extension.toLatexString(expr, this.$);
    }
    toListString(expr: A): string {
        return this.extension.toListString(expr, this.$);
    }
    evaluate(expr: A, argList: Cons): [number, U] {
        return this.extension.evaluate(expr, argList, this.$);
    }
    transform(expr: A): [number, U] {
        return this.extension.transform(expr, this.$);
    }
    valueOf(expr: A): U {
        return this.extension.valueOf(expr, this.$);
    }
}