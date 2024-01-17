import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
import { AbstractOperator } from "./AbstractOperator";

/**
 * An operator that matches (opr ...), with a variable number of arguments.
 */
export abstract class FunctionVarArgs extends AbstractOperator {
    readonly key: string;
    constructor(name: string, readonly opr: Sym, $: ExtensionEnv) {
        super(name, $);
        this.key = `(${opr.key()})`;
    }
    /**
     * Ideally, we'd leave this out...
     */
    get hash(): string {
        return this.key;
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