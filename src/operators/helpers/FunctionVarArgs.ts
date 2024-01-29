import { Sym } from "math-expression-atoms";
import { cons, Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { AbstractOperator } from "./AbstractOperator";

/**
 * An operator that matches (opr ...), with a variable number of arguments.
 */
export abstract class FunctionVarArgs extends AbstractOperator {
    readonly #hash: string;
    readonly #operator: Sym;
    constructor(name: string, readonly opr: Sym, $: ExtensionEnv) {
        super(name, $);
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
    evaluate(argList: Cons): [number, U] {
        const expr = cons(this.opr, argList);
        try {
            return this.transform(expr, this.$);
        }
        finally {
            expr.release();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        throw new Error(`FunctionVarArgs.transform must be implemented in ${this.name}`);
    }
    isKind(expr: Cons): expr is Cons {
        return expr.opr.equals(this.opr);
    }
}