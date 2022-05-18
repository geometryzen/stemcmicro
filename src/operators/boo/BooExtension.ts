import { CostTable } from "../../env/CostTable";
import { Extension, ExtensionEnv, NOFLAGS, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_BOO } from "../../hashing/hash_info";
import { Boo, True } from "../../tree/boo/Boo";
import { U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

export class BooExtension implements Extension<Boo> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return True.name;
    }
    get hash(): string {
        return HASH_BOO;
    }
    get name(): string {
        return 'BooExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: Boo, costs: CostTable): number {
        return 1;
    }
    transform(expr: U): [TFLAGS, U] {
        if (expr instanceof Boo) {
            return [STABLE, expr];
        }
        else {
            return [NOFLAGS, expr];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Boo, $: ExtensionEnv): U {
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Boo): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(arg: U): arg is Boo {
        return arg instanceof Boo;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(arg: Boo, $: ExtensionEnv): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(arg: Boo, $: ExtensionEnv): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Boo): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(arg: Boo, $: ExtensionEnv): boolean {
        throw new Error("Boo Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Boo, $: ExtensionEnv): Boo {
        // Boo does not have a zero value.
        throw new Error();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Boo, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        throw new Error("Boo Method not implemented.");
    }
    toInfixString(expr: Boo): string {
        return expr.equals(True) ? 'true' : 'false';
    }
    toListString(expr: Boo): string {
        return expr.equals(True) ? 'true' : 'false';
    }
}

export const boo = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new BooExtension($);
});