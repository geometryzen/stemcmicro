import { CostTable } from "../../env/CostTable";
import { Extension, ExtensionEnv, NOFLAGS, Sign, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { emptyStr, Str } from "../../tree/str/Str";
import { U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";


export function strcmp(str1: string, str2: string): Sign {
    if (str1 === str2) {
        return 0;
    }
    else if (str1 > str2) {
        return 1;
    }
    else {
        return -1;
    }
}

export function is_str(arg: unknown): arg is Str {
    return arg instanceof Str;
}

class StrExtension implements Extension<Str> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return emptyStr.name;
    }
    get name(): string {
        return 'StrExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: Str, costs: CostTable, depth: number, $: ExtensionEnv): number {
        return 1;
    }
    valueOf(str: Str): U {
        return str;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Str): boolean {
        return false;
    }
    isKind(arg: unknown): arg is Str {
        return is_str(arg);
    }
    isMinusOne(): boolean {
        return false;
    }
    isOne(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Str): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Str): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Str): boolean {
        return true;
    }
    isZero(): boolean {
        return false;
    }
    one(): Str {
        throw new Error();
    }
    subst(expr: Str, oldExpr: U, newExpr: U): U {
        if (is_str(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(str: Str): string {
        return str.toInfixString();
    }
    toListString(str: Str): string {
        return str.toListString();
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_str(expr)) {
            return [TFLAG_HALT, expr];
        }
        return [NOFLAGS, expr];
    }
}

export const str = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new StrExtension($);
});