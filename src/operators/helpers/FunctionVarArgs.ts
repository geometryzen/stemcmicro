import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
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
        return this.transform(expr, this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        throw new Error(`FunctionVarArgs.transform must be implemented in ${this.name}`);
    }
    isKind(expr: Cons): expr is Cons {
        return expr.opr.equals(this.opr);
    }
}