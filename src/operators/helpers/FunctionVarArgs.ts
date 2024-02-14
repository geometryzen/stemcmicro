import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { AbstractExtension } from "./AbstractExtension";

/**
 * An operator that matches (opr ...), with a variable number of arguments.
 */
export abstract class FunctionVarArgs extends AbstractExtension {
    readonly #hash: string;
    readonly #operator: Sym;
    // FIXME: opr is avalable to derived classes, so why #operator?
    constructor(name: string, readonly opr: Sym) {
        super(name);
        // TODO: Is there a more DRY way to do this?
        this.#hash = `(${opr.key()})`;
        this.#operator = opr;
    }
    /**
     * TODO: Is it good to provide this generic base implementation?
     */
    get hash(): string {
        return this.#hash;
    }
    iscons(): boolean {
        return true;
    }
    operator(): Sym {
        return this.#operator;
    }
    evaluate(opr: U, argList: Cons, $: ExtensionEnv): [number, U] {
        const expr = cons(this.opr, argList);
        try {
            return this.transform(expr, $);
        }
        finally {
            expr.release();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Cons, opr: Sym, env: ExprContext): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        throw new Error(`FunctionVarArgs.transform must be implemented in ${this.name}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: Cons): expr is Cons {
        return expr.opr.equals(this.opr);
    }
}