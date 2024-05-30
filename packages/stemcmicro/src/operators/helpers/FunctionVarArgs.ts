import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { cons, Cons, is_cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { AbstractExtension } from "./AbstractExtension";

/**
 * An operator that matches (opr ...), with a variable number of arguments.
 */
export abstract class FunctionVarArgs<T extends Cons> extends AbstractExtension<T> {
    readonly #hash: string;
    readonly #operator: Sym;
    // FIXME: opr is avalable to derived classes, so why #operator?
    constructor(
        name: string,
        readonly opr: Sym
    ) {
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
    evaluate(opr: T, argList: Cons, $: ExtensionEnv): [number, U] {
        const expr = cons(this.opr, argList) as T;
        try {
            return this.transform(expr, $);
        } finally {
            expr.release();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(expr: T, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(expr: T, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: T, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: T, opr: Sym, env: ExprContext): boolean {
        throw new Error("Method not implemented.");
    }
    abstract transform(expr: T, $: ExtensionEnv): [number, U];
    valueOf(expr: T, $: ExtensionEnv): U {
        return this.transform(expr, $)[1];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: U, $: ExtensionEnv): expr is T {
        if (is_cons(expr)) {
            return expr.opr.equals(this.opr);
        } else {
            return false;
        }
    }
}
