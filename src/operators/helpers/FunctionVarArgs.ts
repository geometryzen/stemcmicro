import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
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
    isKind(expr: Cons): boolean {
        return expr.opr.equals(this.opr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Cons): boolean {
        return false;
    }
}